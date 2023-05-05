
import { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";

import { pokerInstance } from "../../utils/axios.config";
import { socket } from "../../config/socketConnection";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
const VerifyPasswordPopup = ({
  verifyPassword,
  userId,
  tableId,
  setVerifyPassword
}) => {
  const history = useHistory()
  const [isLoading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const joinGame = async (e) => {
    e.preventDefault();
    if (password === '' || !password) {
      setError("Please enter password")
    }
    try {
      setLoading(true)
      const res = await pokerInstance().post('/verifyPrivateTable', { tableId, password })
      setLoading(false)
      const { verify } = res?.data
      if (verify) {
        socket.emit("checkAlreadyInGame", { userId, tableId });
        socket.on("userAlreadyInGame", (value) => {
          const { message, join } = value;
          if (join) {
            history.push({
              pathname: "/table",
              search: "?gamecollection=poker&tableid=" + tableId,
            });
          } else {
            toast.error(message, { toastId: "create-table-error" });
          }
        });
      }
    } catch (err) {
      console.log("Error--->", err?.response)
      setLoading(false)
      toast.error(err?.response?.data?.message || "Internal server error", { toastId: "create-table-error" });
    }

  };

  const redirectToLobby = () => {
    setError('')
    setVerifyPassword(false)
  };

  return (
    <Modal
      show={verifyPassword}
      centered
      className="friends-popup leave-confirm sitinPopup"
    >
      <Modal.Body>
        <Form className="block">
          <Form.Group className="sitinPopup-div" controlId="formBasicEmail">
            <Form.Label>
              Enter password
            </Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="1we23se233"
            />
            {error && <p className="errorMessage">{error}</p>}
          </Form.Group>

          <div className="sub-btn text-center">
            <Button className="grey-btn" onClick={redirectToLobby}>
              Close
            </Button>
            <Button className="exit-btn" type="submit" onClick={joinGame} /* disabled={disable} */>
              {isLoading ? <Spinner animation="border" /> : 'Verify'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default VerifyPasswordPopup;
