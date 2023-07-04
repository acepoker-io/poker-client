import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { pokerInstance } from "../../utils/axios.config";

const EnterAmountPopup = ({
  handleSitin,
  showEnterAmountPopup,
  submitButtonText,
  setShow,
  disable,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [tableData, setTableData] = useState(null);
  const { search } = useLocation();
  const tableId = new URLSearchParams(search).get("tableid");
  // console.log("tableId ==>", tableId);

  useEffect(() => {
    (async () => {
      const resp = await pokerInstance().get('/getTableById', {
        params: {
          tableId
        }
      });
      // console.log("resp ==>", resp);
      setTableData(resp.data);
    })()

  }, [tableId])


  const joinGame = async (e) => {
    e.preventDefault();

    // const resp = await pokerInstance().get('/getTableById', {
    //   params: {
    //     tableId
    //   }
    // });
    // console.log("resp ==>", resp);
    const { bigBlind } = tableData;
    // let chips = parseFloat(amount) * 100;
    console.log("amount ==>", amount, bigBlind);

    // if(amount){
    //   setAmount(Parse)
    // }

    if (parseFloat(amount) >= bigBlind) {
      setLoading(true);
      const msg = await handleSitin(amount);
      // setLoading(false);
      console.log("msg ===>", msg);
      // if (msg) {
      //   setError(msg);
      // }
      setLoading(false);
      setError("");
      setAmount("");
    } else if (parseFloat(amount) < bigBlind) {
      setError(`Minimum amount to enter is ${ bigBlind }.`);
    } else {
      setError("Please enter amount.");
    }
  };
  const handleAmountChange = (e) => {
    let val = e.target.value;
    console.log("amt ==>", val, e.target);
    // if (val.toString().includes("-") || val.toString().includes("e")) {
    val = val.replace(/\D+/g, "");
    // }
    //  += key;
    console.log("handle wthdraw executed", val);
    // val = e.target.value;
    setAmount(val);
  };

  const redirectToLobby = () => {
    setError('')
    if (submitButtonText.toLowerCase().startsWith("refill")) {
      setShow(false);
    } else {
      window.location.href = window.location.origin;
    }
  };

  return (
    <Modal
      show={showEnterAmountPopup}
      centered
      className="friends-popup leave-confirm sitinPopup"
    >
      <Modal.Body>
        <Form className="block">
          <Form.Group className="sitinPopup-div" controlId="formBasicEmail">
            <Form.Label>
              Enter{" "}
              {submitButtonText.toLowerCase().startsWith("refill")
                ? "Refill"
                : "Sit in"}{" "}
              amount
            </Form.Label>
            <Form.Control
              type="text"
              onChange={handleAmountChange}
              value={amount}
              placeholder={`minimum amount: ${ tableData?.bigBlind }`}
            />
            {error && <p className="errorMessage">{error}</p>}
          </Form.Group>

          <div className="sub-btn text-center">
            <Button className="grey-btn" onClick={redirectToLobby}>
              {submitButtonText.toLowerCase().startsWith("refill")
                ? "Close"
                : "Lobby"}
            </Button>
            {/* {console.log("is loading =======", isLoading)} */}
            <Button className="exit-btn" type="submit" onClick={joinGame} disabled={disable}>
              {isLoading ? <Spinner animation="border" /> : submitButtonText}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EnterAmountPopup;
