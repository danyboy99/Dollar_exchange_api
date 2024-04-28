const validator = require("validator");
const isEmpty = require("./isEmpty.js");

const validateAmount = (data) => {
  let error = {};

  data.amount = !isEmpty(data.amount) ? data.amount : "";

  if (validator.isEmpty(data.amount)) {
    error.amount = "amount field is Required";
  }

  if (!validator.isNumeric(data.amount)) {
    error.amount = "amount must be a number";
  }

  return {
    error,
    isValid: isEmpty(error),
  };
};

module.exports = validateAmount;
