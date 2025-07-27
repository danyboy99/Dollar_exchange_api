// Import validation utilities
const validator = require("validator");
const isEmpty = require("./isEmpty.js");

// Validate checkout input data (OTP and Flutterwave reference)
const validatePaymentInput = (data) => {
  let error = {};

  // Set default empty strings for validation
  data.otp = !isEmpty(data.otp) ? data.otp : "";
  data.flw_ref = !isEmpty(data.flw_ref) ? data.flw_ref : "";

  // Validate required fields
  if (validator.isEmpty(data.otp)) {
    error.otp = "otp field is Required";
  }

  if (validator.isEmpty(data.flw_ref)) {
    error.flw_ref = "flw_fre field is Required";
  }

  // Return validation result
  return {
    error,
    isValid: isEmpty(error),
  };
};

// Export validation function
module.exports = validatePaymentInput;
