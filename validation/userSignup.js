const validator = require("validator");
const isEmpty = require("./isEmpty.js");

const validateSignupInput = (data) => {
  let error = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
  data.lastname = !isEmpty(data.lastname) ? data.lastname : "";
  data.username = !isEmpty(data.username) ? data.username : "";

  if (validator.isEmpty(data.email)) {
    error.email = "email field is Required";
  }

  if (!validator.isEmail(data.email)) {
    error.email = "Email is invalid.";
  }

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

  return {
    error,
    isValid: isEmpty(error),
  };
};

module.exports = validateSignupInput;
