import { useState } from "react";
import InputRange from "react-input-range";
import { Form, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import numFormatter from "../../utils/utils";

const RaiseSlider = ({ currentPlayer, SliderAction, roomData, remainingTime }) => {
  const [rangeBetValue, setRangeBetValue] = useState(roomData.raiseAmount * 2);
  const { wallet } = currentPlayer || {};

  const handleRaiseAmount = (e) => {
    const { value } = e.target;
    if (value > wallet) {
      toast.error("You dont have enough balance", { id: "A" });
      return;
    }
    setRangeBetValue(value);
  };


  const onBlurChange = () => {
    if (rangeBetValue < roomData?.raiseAmount * 2) {
      toast.error(`Raise amount must be double of ${ roomData?.raiseAmount }`, { id: "A" });
      return;
    }
  }

  const maxBetValue = numFormatter(currentPlayer?.wallet);
  const minBetValue = numFormatter((roomData?.raiseAmount * 2) <= currentPlayer?.wallet ? roomData?.raiseAmount * 2 : currentPlayer?.wallet);

  return (

    <div className="raise-inputRange">
      <Form className="customBet-amount">
        <div className="raiseSliderCustom">
          <div className="inputRange-Box">
            <InputRange
              maxValue={currentPlayer?.wallet}
              minValue={roomData?.raiseAmount * 2}
              value={rangeBetValue}
              onChange={(e) => setRangeBetValue(e)}
              onChangeComplete={(betAmt) => {
                console.log({ betAmt: betAmt });
              }}
            />
            <div className="inputRangeSlider">
              <span className="minValueSpan">{minBetValue}</span>
              <span className="maxValueSpan">{maxBetValue}</span>
            </div>
          </div>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Control
              type="number"
              placeholder="ex:0"
              value={rangeBetValue > 0 && rangeBetValue}
              onChange={(e) => handleRaiseAmount(e)}
              onBlur={onBlurChange}
            />
          </Form.Group>
        </div>
        {currentPlayer && (
          <Button
            variant="primary"
            onClick={(e) => SliderAction(e, parseFloat(rangeBetValue))}
            disabled={rangeBetValue <= 0 || remainingTime <= 1}
            type="submit"
          >
            Bet
          </Button>
        )}
      </Form>
    </div>
  );
};

export default RaiseSlider;
