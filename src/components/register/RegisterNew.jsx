/* eslint-disable prettier/prettier */
/* eslint-disable react/require-default-props */
import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import FormPhone from "./FormPhone";
import "./Register.css";
import "../login/Login.css";
import FormOtp from "./FormOtp";
import CreateAccount from "./CreateAccount";
// import CreateAccount from "./CreateAccount";
// import FormOtp from "./FormOtp";

function RegisterNew() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState();

  const captchaRef = useRef(null);
  return (
    <div className="register-content">
      <GetRegisterUi
        step={step}
        setStep={setStep}
        phone={phone}
        setPhone={setPhone}
        captchaRef={captchaRef}
      />
    </div>
  );
}

function GetRegisterUi({ step, setStep, phone, setPhone, captchaRef }) {
  switch (step) {
    case 2:
      return (
        <FormOtp
          step={step}
          setStep={setStep}
          phone={phone}
          setPhone={setPhone}
        />
      );
    case 3:
      return (
        <CreateAccount
          step={step}
          setStep={setStep}
          phone={phone}
          setPhone={setPhone}
        />
      );
    default:
      return (
        <FormPhone
          step={step}
          setStep={setStep}
          phone={phone}
          setPhone={setPhone}
          captchaRef={captchaRef}
        />
      );
  }
}

GetRegisterUi.defaultProps = {
  step: 1,
  setStep: () => { },
  phone: 1,
  setPhone: () => { },
};

GetRegisterUi.propTypes = {
  step: PropTypes.any,
  setStep: PropTypes.any,
  phone: PropTypes.any,
  setPhone: PropTypes.any,
  captchaRef: PropTypes.object,
};
export default RegisterNew;
