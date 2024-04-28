const validator = require("validator");
const isEmpty = require("./isEmpty.js");

const validatePaymentInput = (data) => {
  let error = {};

  data.otp = !isEmpty(data.otp) ? data.otp : "";
  data.flw_ref = !isEmpty(data.flw_ref) ? data.flw_ref : "";

  if (validator.isEmpty(data.otp)) {
    error.otp = "otp field is Required";
  }

  if (validator.isEmpty(data.flw_ref)) {
    error.flw_ref = "flw_fre field is Required";
  }

  return {
    error,
    isValid: isEmpty(error),
  };
};

module.exports = validatePaymentInput;
