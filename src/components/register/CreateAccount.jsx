import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";
// import moment from "moment";
import { toast } from "react-toastify";
//import { authInstance } from "../../config/axios";
// import sms from "../asset/image/LoginBackground/sms.svg";

// import logo from "../asset/image/header/logo.svg";
// import LoginBackground from "../global/LoginRegisterHome/LoginBackground";
// import google from "../asset/image/LoginBackground/google.svg";
// import key from "../asset/image/LoginBackground/key.svg";
import "./Register.css";
import UserContext from "../../context/UserContext";
import axios from "axios";

// eslint-disable-next-line operator-linebreak
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*.,])[a-zA-Z0-9!@#$%^&*.,]{6,16}$/;
function CreateAccount({ phone, setPhone }) {
  const { setUser, setToken } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setError,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });
  const termsWatch = watch("termsAccept");
  // const navigate = useNavigate();

  const onSubmit = async (value) => {
    try {
      const { firstName, lastName, email, password, username } = value;

      if (username.split(" ").length >= 2) {
        setError("username", { message: "Username can't contain spaces" });
        return;
      }

      const payload = {
        firstName,
        lastName,
        username,
        email,
        password,
        phone,
        termsAccept: termsWatch,
      };
      const { data } = await axios.post("/registerUser", payload, {
        withCredentials: true,
        credentials: "include",
      });

      if (data.registered) {
        const { tokens, status, msg, user } = data.registered;
        if (status === 200) {
          localStorage.setItem("token", tokens.access.token);
          setToken(tokens.access.token);
          setUser(user);
          reset();
          setPhone("");
          toast.success(msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
          });
          window.location.reload();
        }
      }
    } catch (er) {
      toast.error(er.response.data.msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  return (
    <div className="create-account">
      <div className="login-content" style={{ height: "100%" }}>
        <div className="reg-form">
          <h1>Create your account</h1>
          <p>Complete the registration form</p>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-details">
              <Form.Group className="reg-name" controlId="fiormBasicEmal">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  {...register("firstName", {
                    required: "First Name required",
                    minLength: {
                      value: 3,
                      message: "First name at least 3 character",
                    },
                    maxLength: {
                      value: 30,
                      message: "First name should be at least 30 character",
                    },
                  })}
                  type="text"
                  placeholder="First Name"
                />
                {errors && errors.firstName && (
                  <p className="error-msg">{errors.firstName.message}</p>
                )}
              </Form.Group>
              <Form.Group className="reg-name" controlId="fiormBasicEmal">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  {...register("lastName", {
                    required: "Last Name required",
                    minLength: {
                      value: 3,
                      message: "Last name at least 3 character",
                    },
                    maxLength: {
                      value: 30,
                      message: "Last name should be at least 30 character",
                    },
                  })}
                  type="text"
                  placeholder="Last Name"
                />
                {errors && errors.lastName && (
                  <p className="error-msg">{errors.lastName.message}</p>
                )}
              </Form.Group>
              <Form.Group className="reg-name" controlId="fiormBasicEmal">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  {...register("username", {
                    required: "Username required",
                    minLength: {
                      value: 3,
                      message: "Username at least 3 character",
                    },
                    maxLength: {
                      value: 30,
                      message: "Username should be at least 30 character",
                    },
                  })}
                  type="text"
                  placeholder="Username"
                />
                {errors && errors.username && (
                  <p className="error-msg">{errors.username.message}</p>
                )}
              </Form.Group>

              <Form.Group className="reg-mail" controlId="fiormBasicEmal">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  {...register("email", {
                    required: "email required",
                    pattern: {
                      value: emailRegex,
                      message: "please enter valid email",
                    },
                  })}
                  type="email"
                  placeholder="example@mail.com"
                />
                {errors && errors.email && (
                  <p className="error-msg">{errors.email.message}</p>
                )}
              </Form.Group>
              <Form.Group className="reg-mail" controlId="fiormBasicEmal">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  {...register("password", {
                    required: "password required",
                    pattern: {
                      value: passRegex,
                      message:
                        "A minimum 8 characters password contains a combination of uppercase and lowercase letter and number are required.",
                    },
                  })}
                  type="password"
                  placeholder="••••••••"
                />
                {errors && errors?.password && (
                  <p className="error-msg">{errors?.password.message}</p>
                )}
              </Form.Group>
              <Form.Group className="reg-mail" controlId="fiormBasicEmal">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  {...register("confirmPassword", {
                    ...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (val) => {
                        if (watch("password") !== val) {
                          return "Your passwords do not match";
                        }
                      },
                    }),
                  })}
                  type="password"
                  placeholder="••••••••"
                />
                {errors && errors?.password && (
                  <p className="error-msg">{errors.password.message}</p>
                )}
              </Form.Group>
              <div className="agreebox col-md-12">
                {/* <input type="checkbox" /> */}
                <Form.Control
                  type="checkbox"
                  name="termsAccept"
                  className="form-check-input checkbox16"
                  {...register("termsAccept", {
                    required: "Terms required",
                  })}
                />
                <small>
                  &nbsp; I am 17 years of age or older and agree to&nbsp;
                  <Link
                    className="signup-link"
                    target="_blank"
                    to="/terms-of-use"
                  >
                    Terms
                  </Link>
                  &nbsp; and &nbsp;
                  <Link
                    className="signup-link"
                    target="_blank"
                    to="/privacy-policy"
                  >
                    Privacy policy
                  </Link>
                  {errors && errors?.termsAccept && (
                    <p className="error-msg">{errors.termsAccept.message}</p>
                  )}
                </small>
              </div>
            </div>

            {/* <Form.Group className="reg-mail" controlId="fiormBasicEmal">
              <Form.Label>
                Repeat Password
                <span>*</span>
              </Form.Label>
              <img src={key} alt="" />
              <Form.Control
                {...register("confirmPassword", {
                  required: "password required",
                  validate: (val) => {
                    if (watch("password") !== val) {
                      return "Your passwords do not match";
                    }
                  },
                })}
                type="password"
                placeholder="••••••••"
              />
              {errors && errors.confirmPassword && (
                <span className="text-danger">
                  {errors.confirmPassword.message}
                </span>
              )}
            </Form.Group> */}

            <Button
              variant="primary"
              className="loginBtn"
              type="submit"
              disabled={!termsWatch}
            >
              Create Account
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

CreateAccount.defaultProps = {
  step: 1,
  setStep: () => {},
  phone: "",
  setPhone: () => {},
};

CreateAccount.propTypes = {
  step: PropTypes.any,
  setStep: PropTypes.any,
  phone: PropTypes.any,
  setPhone: PropTypes.any,
};

export default CreateAccount;
