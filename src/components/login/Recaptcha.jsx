import React from "react";
import PropTypes from "prop-types";
import ReCAPTCHA from "react-google-recaptcha";

function MyReCaptcha({ handlereCaptcha, captchaRef }) {
  return (
    <ReCAPTCHA
      ref={captchaRef} // (r) => setCaptchaRef(r)
      theme="dark"
      sitekey="6LcXOSsjAAAAANnOVhJIFQN1YpGTLr5tplGh507b"
      // sitekey="6LdBOAkfAAAAAGVoi62X3sn0tpOInlOzoIsSTfU2"
      onChange={handlereCaptcha}
      className="recaptcha"
    />
  );
}
MyReCaptcha.propTypes = {
  handlereCaptcha: PropTypes.func.isRequired,
  captchaRef: PropTypes.object.isRequired,
};
export default MyReCaptcha;
