/* eslint-disable prettier/prettier */
import React, { useContext, useState, /* useRef */ } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { /* Form */ Button } from "react-bootstrap";
// import axios from "axios";
import FacebookLogin from "react-facebook-login";

import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
// import PhoneInput from "react-phone-number-input";
// import PhoneInput from "react-phone-input-2";
import "react-phone-number-input/style.css";
import { toast } from "react-toastify";
// import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { authInstance } from "../../config/axios";
import logo from "../asset/image/header/logo.png";
// import userImg from "../asset/image/LoginBackground/user.svg";
import "./Login.css";
import Layout from "../layout/layout";
// import MyReCaptcha from "./Recaptcha";
import UserContext from "../../context/userContext";
// import GlobalButton from "../global/button/globalButton";
import { manualLoginSchema } from "../../utils/validationSchema";
import Loader from "../pageLoader/loader";

function Login() {
  // let captchaa;
  // const navigate = useNavigate();
  const { setUser, setToken } = useContext(UserContext);
  // const [phone, setPhone] = useState();
  // const captchaRef = useRef(null);
  // const [country] = useState("US");
  // const [loader, setLoader] = useState(false);
  // const [captcha, setReCaptcha] = useState(false);
  // const [recaptchaResponse, setRecaptchaResponse] = useState();
  // eslint-disable-next-line no-empty-pattern
  const {
    // register,
    // handleSubmit,
    // formState: { errors },
    // reset,
    // setValue,
  } = useForm({ mode: "onBlur", resolver: yupResolver(manualLoginSchema) });
  // const [passwdValues, setPasswdValues] = useState({
  //   password: "",
  //   showPassword: false,
  // });
  // const [showPassword, setShowPassword] = useState(false);
  // const handleClickShowPassword = () => {
  //   setError({ password: "", phone: "" })
  //   setPasswdValues({
  //     ...passwdValues,
  //     showPassword: !passwdValues.showPassword,
  //   });
  // };
  // const handleLogin = async (values) => {
  //   try {
  //     setLoader(true);
  //     const response = await authInstance().post(
  //       "/login",
  //       {
  //         ...values,
  //         phone,
  //         recaptchaResponse,
  //       },
  //       { withCredentials: true, credentials: "include" }
  //     );
  //     const {
  //       data: {
  //         tokens: { access, refresh },
  //         user,
  //       },
  //       status,
  //     } = response;
  //     if (status === 200) {
  //       const { token } = access;
  //       setUser(user);
  //       setToken(token);
  //       localStorage.setItem("token", token);
  //       if (refresh) {
  //         localStorage.setItem("refreshToken", refresh.token);
  //       }
  //       localStorage.setItem("userid", user?.id);
  //       reset();
  //       window.location.href = "/profile";
  //       captchaa.reset();
  //     } else {
  //       // console.log("reacptcha reset executed successfully");
  //       setReCaptcha(false);
  //     }
  //     setLoader(false);
  //   } catch (e) {
  //     setLoader(false);
  //     if (axios.isAxiosError(e) && e.response) {
  //       if (e.response.status !== 200) {
  //         toast.error(e?.response?.data?.message, { toastId: "login" });
  //         // console.log("reacptcha reset executed successfully");
  //         setReCaptcha(false);
  //         captchaRef.current.reset();
  //       }
  //     }
  //   }
  // };

  // const setCaptchaRef = () => {
  //   // if (ref) {
  //   //   return (captchaa = ref);
  //   // }
  // };

  // const handlereCaptcha = (value) => {
  //   // console.log("captcha value", value);
  //   if (value) {
  //     setReCaptcha(true);
  //     setRecaptchaResponse(value);
  //   }
  // };

  // if (loader) {
  //   return <Loader />
  // }

  const responseFacebook = async (response) => {
    try {
      if (!response.error) {
        const payload = {
          facebookId: response.userID,
          accessToken: response.accessToken,
          facebookName: response.name,
          facebookEmail: response.email ? response.email : "",
        };
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
    <Layout>
      <div className="login account-create">
        <div className="login-section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="register-wrapper">
                  <div className="login-form">
                    <Link to="/">
                      <img src={logo} alt="logo" className="title-mobile" />
                    </Link>
                    <div className="google-login">
                      <GoogleOAuthProvider clientId="763455560241-hlc1jsphkbj4ejpnj92h3snulc4hfs40.apps.googleusercontent.com">
                        <LoginButton className="google-login-btn btn btn-primary" />
                      </GoogleOAuthProvider>
                      <div className="divider">
                        <span>OR</span>
                      </div>
                     
                    </div>
                    <div>                   
                 <FacebookLogin
                appId="590649203004238" 
                fields="name,email,picture"
                callback={responseFacebook}
                icon="fa fa-facebook"
                textButton="login  with Facebook"
                // className="google-login-btn btn btn-primary"
              />
              </div>
                    {/* <div className="login-box">
                      <Form onSubmit={handleSubmit(handleLogin)}>
                        <div className="row">
                          <div className="col-md-12">
                            <Form.Group
                              controlId="formPhone"
                              className="form-group"
                            >
                              <Form.Label>Phone Number</Form.Label>
                            
                              <div className="loginPoneInput">
                                <PhoneInput
                                  className="phone_input"
                                  placeholder="Enter phone number"
                                  country="us"
                                  value={phone}
                                  onChange={(value) => {
                                    setPhone(`+${value}`);
                                    setValue("phone", `+${value}`);
                                  }}
                                  inputProps={{
                                    name: "phone",
                                  }}
                                />
                              </div>
                              {errors.phone && (
                                <p className="error-msg">
                                  {errors.phone.message}
                                </p>
                              )}
                            </Form.Group>
                          </div>

                          <div className="col-md-12">
                            <Form.Group
                              controlId="formPassword"
                              className="form-group"
                            >
                              <Form.Label>Password</Form.Label>
                              <Form.Control
                                type={showPassword ? "text" : "password"}
                                autoComplete="off"
                                placeholder="Enter Password"
                                {...register("password", {
                                  required: "Enter Valid Password",
                                })}
                                className={errors.password ? "error-input" : ""}
                              />
                              <i
                                className={
                                  showPassword
                                    ? "las la-eye"
                                    : "las la-eye-slash"
                                }
                                id="togglePassword"
                                onClick={() => setShowPassword(!showPassword)}
                                role="presentation"
                              />
                              {errors.password && (
                                <p className="error-msg">
                                  {errors.password.message}
                                </p>
                              )}
                            </Form.Group>
                          </div>
                          <div className="loginfrgtPasswd">
                            <Link to="/forgetPassword">Forgot password ?</Link>
                          </div>
                          <div className="col-md-12">
                            <MyReCaptcha
                              handlereCaptcha={handlereCaptcha}
                              captcha={captcha}
                              setCaptchaRef={setCaptchaRef}
                              captchaRef={captchaRef}
                            />
                          </div>

                          <div className="col-md-12">
                            <p style={{ color: "#b9a11e" }}>
                            
                            </p>
                            <div className="login-button">
                              <GlobalButton
                                type="submit"
                                isloader={loader}
                                btnClass="yellowBtn"
                                name="Login"
                              />
                            </div>
                          </div>
                        </div>
                      </Form>
                      <p className="already">
                        Don&apos;t have an account yet?
                        <Link className="signup-link" to="/">
                          Register
                        </Link>
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Login;

function LoginButton() {
  const { setUser, setToken } = useContext(UserContext);
  const [loader, setLoader] = useState(false);

  const handleGoogleSuccess = async (info) => {
    // console.log("info", info);
    try {
      if (info.error) {
        return;
      }

      const profilePayload = {
        accessToken: info.access_token,
      };
      setLoader(true);
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
        setTimeout(() => {
          window.location.href = "/profile";
          toast.success("You are logged in successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
          });
        }, 1000);
      }
    } catch (err) {
      setLoader(false);
      toast.error(err.response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };
  // const handleGoogleFail = async (res) => {
  //   toast.error(res.error, {
  //     position: "top-right",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //   });
  // };
  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    ux_mode: "popup",
  });

  if (loader) {
    return <Loader />;
  }

  return (
    <div className="login-button" id="buttonDiv">
      <Button onClick={login}>
        <i className="fa fa-google" aria-hidden="true" />
        Login with
        <b> Google</b>
      </Button>
      {/* <GoogleLogin
      clientId="293307520067-88t0bbbg6nirei5eplt1ee5lard0uoua.apps.googleusercontent.com"
      render={(renderProps) => (
        <Button onClick={renderProps.onClick}>
          <i className="fa fa-google" aria-hidden="true" />
          Login with
          <b> Google</b>
        </Button>
      )}
      buttonText="Login"
      onSuccess={handleGoogleSuccess}
      onFailure={handleGoogleSuccess}
      cookiePolicy="single_host_origin"
    /> */}
      {/* <GoogleLogin
      clientId="612172430606-emul27satgghj2p8scilnva21028q8r0.apps.googleusercontent.com"
      buttonText=""
      onSuccess={handleGoogleSuccess}
      onFailure={handleGoogleFail}
      cookiePolicy="single_host_origin"
    /> */}
    </div>
  );
}
