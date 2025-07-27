// Validate amount input for balance operations
const validateAmount = (data) => {
  let errorStatus = false;
  let error = {};

  // Check if amount is a valid number
  if (!Number(data.amount)) {
    errorStatus = true;
    error.amount = "amount must be a number";
  }

  // Return validation result
  return {
    errorStatus,
    error,
  };
};

// Export validation function
module.exports = validateAmount;
