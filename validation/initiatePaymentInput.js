const validator = require("validator");
const isEmpty = require("./isEmpty.js");

const validatePaymentInput = (data) => {
  let error = {};

  data.card_number = !isEmpty(data.card_number) ? data.card_number : "";
  data.card_cvv = !isEmpty(data.card_cvv) ? data.card_cvv : "";
  data.card_exp_month = !isEmpty(data.card_exp_month)
    ? data.card_exp_month
    : "";
  data.card_exp_year = !isEmpty(data.card_exp_year) ? data.card_exp_year : "";
  data.card_pin = !isEmpty(data.card_pin) ? data.card_pin : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.address = !isEmpty(data.address) ? data.address : "";
  data.name = !isEmpty(data.name) ? data.name : "";

  if (validator.isEmpty(data.card_number)) {
    error.card_number = "card_number field is Required";
  }

  if (!validator.isLength(data.name, { min: 2, max: 35 })) {
    error.name = "name must be between 2 to 35 characters.";
  }

  if (validator.isEmpty(data.card_cvv)) {
    error.card_cvv = "card_cvv field is Required";
  }
  if (validator.isEmpty(data.card_exp_month)) {
    error.card_exp_month = "card_exp_month field is Required";
  }
  if (validator.isEmpty(data.card_exp_year)) {
    error.card_exp_year = "card_exp_year field is Required";
  }
  if (validator.isEmpty(data.card_pin)) {
    error.card_pin = "card_pin field is Required";
  }
  if (validator.isEmpty(data.email)) {
    error.email = "email field is required";
  }
  if (validator.isEmpty(data.address)) {
    error.address = "address field is required";
  }
  if (validator.isEmpty(data.name)) {
    error.name = "name field is required";
  }
  if (!Number(data.amount)) {
    error.amount = "amount field must be a number";
  }
  return {
    error,
    isValid: isEmpty(error),
  };
};

module.exports = validatePaymentInput;
