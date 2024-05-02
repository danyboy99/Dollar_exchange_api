const validateAmount = (data) => {
  let errorStatus = false;
  let error = {};
  if (!Number(data.amount)) {
    errorStatus = true;
    error.amount = "amount must be a number";
  }

  return {
    errorStatus,
    error,
  };
};

module.exports = validateAmount;
