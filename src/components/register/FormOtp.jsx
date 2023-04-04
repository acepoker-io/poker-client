/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { OtpVerifySchema } from "../../utils/validationSchema";
import { authInstance } from "../../config/axios";
import GlobalButton from "../global/button/globalButton";

function FormOtp({ setStep, step, phone }) {
  const [otpText, setOtpText] = useState("");
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({ resolver: yupResolver(OtpVerifySchema) });
  const [loader, setLoader] = useState(false);

  const verifyOtp = async (values) => {
    try {
      setLoader(true);
      const res = await authInstance().post("/verifyRegisterOtp", {
        ...values,
        phone,
      });
      const {
        status,
        data: { msg },
      } = res;
      if (status === 200) {
        toast.success(msg, { toastId: "verifyRegisterOtp" });
        setStep(step + 1);
      }
      setLoader(false);
    } catch (err) {
      setLoader(false);
      toast.error(err.response.data.message, { toastId: "verifyRegisterOtp" });
    }
  };

  const velidateOtp = (e) => {
    if (e.target.value?.length <= 6) {
      setOtpText(e.target.value);
    }
  };

  return (
    <div className="otp-form">
      <h1>OTP</h1>
      <p>Code sent via SMS, Please fill your OTP to create your account</p>
      <div className="rigister-tab">
        <Form onSubmit={handleSubmit(verifyOtp)}>
          <div className="step-2">
            <Form.Group controlId="formOTP" className="form-group">
              <Form.Label>Enter OTP</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter your OTP"
                name="otp"
                autoComplete="off"
                {...register("otp")}
                onChange={velidateOtp}
                value={otpText}
              />
              <p style={{ color: "#b9a11e" }} />
              {errors && errors.otp && (
                <p className="error-msg">{errors.otp.message}</p>
              )}
            </Form.Group>
            <div className="text-center">
              <GlobalButton
                btnClass="yellowBtn s-btn"
                btnType="submit"
                isloader={loader}
                // handleClick={() => setStep(step + 1)}
                name="Next"
              />
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

FormOtp.defaultProps = {
  step: 1,
  setStep: () => { },
  phone: "",
  verifyType: "",
};

FormOtp.propTypes = {
  step: PropTypes.any,
  setStep: PropTypes.any,
  phone: PropTypes.any,
  verifyType: PropTypes.any,
};

export default FormOtp;
