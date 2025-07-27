// Import validation utilities
const validator = require("validator");
const isEmpty = require("./isEmpty.js");

// Validate user signup input data
const validateSignupInput = (data) => {
  let error = {};

  // Set default empty strings for validation
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
  data.lastname = !isEmpty(data.lastname) ? data.lastname : "";
  data.username = !isEmpty(data.username) ? data.username : "";

  // Validate email field
  if (validator.isEmpty(data.email)) {
    error.email = "email field is Required";
  }

  if (!validator.isEmail(data.email)) {
    error.email = "Email is invalid.";
  }

  // Validate required fields
  if (validator.isEmpty(data.password)) {
    error.password = "password field is Required";
  }
  if (validator.isEmpty(data.firstname)) {
    error.firstname = "firstname field is Required";
  }
  if (validator.isEmpty(data.lastname)) {
    error.lastname = "lastname field is Required";
  }

  if (validator.isEmpty(data.username)) {
    error.username = "username field is Required";
  }

  // Return validation result
  return {
    error,
    isValid: isEmpty(error),
  };
};

// Export validation function
module.exports = validateSignupInput;
