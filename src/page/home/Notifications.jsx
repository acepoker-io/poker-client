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
      setNotifications(resp.data);
      setShowSpinner(false);
    } catch (err) {
      console.log(err);
      setShowSpinner(false);
    }
  };

  const getTime = (time) => {
    // console.log("time: ", time);
    // var currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // var currentDate = new Date(time);

    // // Get the options for formatting the date
    // var options = {
    //   timeZone: `${ currentTimeZone }`, // Replace 'YourTimeZone' with the desired time zone, e.g., 'America/New_York'
    //   year: 'numeric',
    //   month: 'long',
    //   day: 'numeric',
    //   hour: 'numeric',
    //   minute: 'numeric',
    //   second: 'numeric'
    // };

    // // Convert the date to the desired time zone
    // var formattedDate = currentDate.toLocaleString(undefined, options);
    // console.log("formattedDate =====>", formattedDate, d, options, currentTimeZone, currentDate)
    let d = new Date(time);
    let pm = d.getHours() >= 12;
    let hour12 = d.getHours() % 12;
    if (!hour12) hour12 += 12;
    let minute = d.getMinutes();
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    return `${ date }/${ month }/${ year } ${ hour12 }:${ minute } ${ pm ? "pm" : "am" }`;
  };

  return (
    <div className='notificationPage'>
      <div className='notificationHeader'>
        <h4>Notification</h4>
      </div>
      <div className='notificationMssg'>
        {notifiCations?.length > 0 ? (
          notifiCations.map((el) => (
            <h6>{`${ el.message } ${ getTime(el.startDate) }`}</h6>
          ))
        ) : showSpinner ? (
          <Spinner animation='border' />
        ) : (
          <div className='noNotification'>You don't have a notification</div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
