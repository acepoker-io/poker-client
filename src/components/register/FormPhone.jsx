/* eslint-disable prettier/prettier */
/* eslint-disable react/require-default-props */
// @ts-nocheck
import React, { useContext, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
import PhoneInput from "react-phone-input-2";
import Proptypes from "prop-types";
// import { toast } from "react-toastify";
import { toast } from "react-toastify";
import googleicon from "../asset/image/home/google.svg";
// import "react-phone-number-input/style.css";
import { PhoneVerifySchema } from "../../utils/validationSchema";
import { authInstance, twilllioInstance } from "../../config/axios";
import UserContext from "../../context/userContext";
import MyReCaptcha from "../login/Recaptcha";

// import { authInstance } from "../../config/axios";

function FormPhone({
  step = 1,
  setStep = () => { },
  setPhone = () => { },
  captchaRef,
}) {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(PhoneVerifySchema) });
  const [captcha, setReCaptcha] = useState(false);
  const { setUser, setToken } = useContext(UserContext);

  const [recaptchaResponse, setRecaptchaResponse] = useState();
  const [show /* setShow */] = useState(true);
  const [loader, setLoader] = useState(false);

  // const handlePhoneChange = (e) => {
  //   setValue("phone", `${e}`);
  // };
  // const handleShow = () => {
  //   setShow(!show);
  // };
  const setCaptchaRef = () => {
    // if (ref) {
    //   return (captchaa = ref);
    // }
  };
  const handlereCaptcha = (value) => {
    if (value) {
      setReCaptcha(true);
      setRecaptchaResponse(value);
    }
  };
  const otpForRegister = async (values) => {
    try {
      setLoader(true);
      const res = await twilllioInstance().post("/verifyPhone", {
        ...values,
        recaptchaResponse,
      });
      const {
        data: { msg, status },
      } = res;
      if (status === 200) {
        toast.success(msg, { toastId: "verifyPhone" });
        setPhone(values.phone);
        setStep(step + 1);
      }
      if (status === 401) {
        setStep(step + 1 + 1);
        setPhone(values.phone);
      }
      setLoader(false);
    } catch (err) {
      setLoader(false);
      captchaRef.current.reset();
      toast.error(err.response.data.message, { toastId: "verifyPhone" });
    }
  };

  const responseFacebook = async (response) => {
    // console.log("--------------------");
    try {
      if (!response.error) {
        const payload = {
          facebookId: response.userID,
          accessToken: response.accessToken,
          facebookName: response.name,
          facebookEmail: response.email ? response.email : "",
        };
        // console.log("payload",payload);
        const res = await authInstance().post("/facebookLogin", payload);
        const {
          status,
          data: {
            tokens: { access },
            user,
          },
        } = res;
        if (status === 200) {
          setUser(user);
          setToken(access.token);
          localStorage.setItem("token", access.token);
          window.location.href = "/profile";
          toast.success("You are login successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
          });
        }
      }
    } catch (error) {
      // console.log("error");
    }
  };
  return (
    <div className="profile register-page signup-step-one">
      <div className="google-login">
        {show ? (
          <>
            <GoogleOAuthProvider clientId="763455560241-hlc1jsphkbj4ejpnj92h3snulc4hfs40.apps.googleusercontent.com">
              <LoginButton />
            </GoogleOAuthProvider>
            <div className="divider">
              <span>OR</span>
            </div>
              <FacebookLogin
                appId="590649203004238"
                fields="name,email,picture"
                callback={responseFacebook}
                icon="fa fa-facebook"
                textButton="Sign up with Facebook"
                className="google-login-btn btn btn-primary"
              />
            {/* <Button
              type="submit"
              className="google-login-btn btn btn-primary"
              onClick={handleShow}
            >
              <b>Phone</b>
              Verification
            </Button> */}
          </>
        ) : (
          <div className="create-phoneinput">
            <h1>Phone Number</h1>
            <p>
              Please enter the Phone number. OTP will send to your registered
              Phone Nubmer.
            </p>
            <Form onSubmit={handleSubmit(otpForRegister)}>
              <div className="step-1">
                <Form.Group controlId="formPhoneNumber" className="form-group">
                  <Form.Label>Enter Phone Number</Form.Label>
                  <PhoneInput
                    className="inputPhoneNumber"
                    placeholder="Enter phone number"
                    country="us"
                    onChange={(value) => {
                      setPhone(value);
                      setValue("phone", `+${ value }`);
                    }}
                    inputProps={{
                      name: "phone",
                    }}
                  />
                  <p style={{ color: "#b9a11e" }} />
                  <p style={{ color: "#b9a11e" }} />
                  {errors && errors.phone && (
                    <p className="error-msg">{errors.phone.message}</p>
                  )}
                </Form.Group>
                <div className="phoneRecaptcha">
                  <MyReCaptcha
                    handlereCaptcha={handlereCaptcha}
                    captcha={captcha}
                    setCaptchaRef={setCaptchaRef}
                    captchaRef={captchaRef}
                  />
                </div>
                <div className="text-center">
                  <Button
                    // onClick={() => setStep(step + 1)}
                    className="s-btn"
                    type="submit"
                  >
                    {loader ? <Spinner animation="border" /> : "Send SMS Code"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}

FormPhone.defaultProps = {
  step: 1,
  setStep: () => { },
  setPhone: () => { },
};

FormPhone.propTypes = {
  step: Proptypes.any,
  setStep: Proptypes.any,
  setPhone: Proptypes.any,
  captchaRef: Proptypes.object,
};

export default FormPhone;

function LoginButton() {
  const { setUser, setToken } = useContext(UserContext);
  const [loader, setLoader] = useState(false);
  const { search } = useLocation();
  const userparamsId = new URLSearchParams(search).get("uid");
  // eslint-disable-next-line no-console
  console.log("userparahvvmsId llaggg", userparamsId);
  const handleGoogleSuccess = async (info) => {
    try {
      if (info.error) {
        return;
      }
      setLoader(true);
      const profilePayload = {
        accessToken: info.access_token,
        refrenceId: userparamsId,
      };
      const res = await authInstance().post("/googleLogin", profilePayload, {
        withCredentials: true,
        credentials: "include",
      });
      const {
        status,
        data: {
          tokens: { access },
          user,
        },
      } = res;
      if (status === 200) {
        setUser(user);
        setToken(access.token);
        localStorage.setItem("token", access.token);
        window.location.href = "/profile";
        toast.success("You are login successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      }
    } catch (err) {
      toast.error(err.response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      setLoader(false);
    }
  };
  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    ux_mode: "popup",
  });
  // const handleGoogleFail = async (res) => {
  //   console.log("res--->", res);
  //   toast.error(res.error, {
  //     position: "top-right",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //   });
  // };
  return (
    <div className="login-button" id="buttonDiv">
      <Button onClick={login}>
        <img src={googleicon} alt="" />
        <span>
          Sign up with
          <b>Google</b>
          {loader ? <Spinner animation="border" /> : null}
        </span>
      </Button>
      {/* <GoogleLogin
        clientId="293307520067-88t0bbbg6nirei5eplt1ee5lard0uoua.apps.googleusercontent.com"
        render={(renderProps) => (
          <Button onClick={renderProps.onClick}>
            <img src={googleicon} alt="" />
            <span>
              Sign up with
              <b>Google</b>
            </span>
          </Button>
        )}
        buttonText="Login"
        onSuccess={handleGoogleSuccess}
        onFailure={handleGoogleSuccess}
        cookiePolicy="single_host_origin"
      /> */}
    </div>
  );
}
