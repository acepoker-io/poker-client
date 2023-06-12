import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
// import times from "../asset/image/friends/times.svg";
// import User1 from "../asset/image/profile/profile.png";
// import socket from "../../config/socket";
// import UserContext from "../../context/userContext";
import { userInstance } from "../../utils/axios.config";

const Notifications = () => {
  const [notifiCations, setNotifications] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    getAllNOtifications();
  }, []);

  const getAllNOtifications = async () => {
    try {
      setShowSpinner(true);
      const resp = await userInstance().get("/getAllNotifications");
      console.log("resp ====>", resp);
      setNotifications(resp.data);
      setShowSpinner(false);
    } catch (err) {
      console.log(err);
      setShowSpinner(false);
    }
  };

  return (
    <div className='notificationPage'>
      <div className='notificationHeader'>
        <h4>Notification</h4>
      </div>
      <div className='notificationMssg'>
        {notifiCations?.length > 0 ? (
          notifiCations.map((el) => <h6>{el.message}</h6>)
        ) : showSpinner ? (
          <Spinner animation='border' />
        ) : (
          <div className='noNotification'>You don't notifications</div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
