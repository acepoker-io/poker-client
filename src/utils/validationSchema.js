import * as yup from "yup";

export const PhoneVerifySchema = yup.object({
  phone: yup.string().required("Phone number is required"),
});
export const OtpVerifySchema = yup.object({
  otp: yup.string().required("OTP is required"),
});
export const loginSchema = yup.object({
  otp: yup.string().required("OTP is required"),
});
export const postSchema = yup.object({
  post: yup.string().required("Message is required"),
});
export const updateProfileSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  username: yup.string().required("Username is required"),
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
  confPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Password doesn't match")
    .required("Confirm password is required"),
});
export const passwordSchema = yup.object({
  password: yup.string().required("Password is required"),
  newPassword: yup
    .string()
    /* .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Enter password inclu"
    ) */
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Password doesn't match")
    .required("Confirm password is required"),
});
export const manualLoginSchema = yup.object({
  phone: yup.string().required("Phone is required"),
  password: yup.string().required("Password is required"),
});
