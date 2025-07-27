// Import required services and validations
const User = require("../services/user.js");
const Order = require("../services/orders.js");
const Product = require("../services/product.js");
const validateSignupInput = require("../validation/userSignup.js");
const validatePaymentInput = require("../validation/initiatePaymentInput.js");
const checkoutInput = require("../validation/checkout.js");
const flutterWave = require("flutterwave-node-v3");
const {
  flutterwavePublicKey,
  flutterwaveSecretKey,
} = require("../config/keys.js");

// Initialize Flutterwave instance
const flw = new flutterWave(flutterwavePublicKey, flutterwaveSecretKey);

// Handle user registration
const signUp = async (req, res) => {
  try {
    // Extract user data from request body
    const { firstname, lastname, username, email, profilepic, password } =
      req.body;

    // Validate input data
    const { error, isValid } = validateSignupInput(req.body);
    if (!isValid) {
      return res.status(400).json(error);
    }

    // Check if user already exists
    const userAlreadyExist = await User.findOneByEmail(email);
    if (userAlreadyExist) {
      return res.json({
        status: "Fail!!",
        msg: "user already exist with this email try Login",
      });
    }

    // Create new user
    const createdUser = await User.create(
      firstname,
      lastname,
      username,
      email,
      password,
      profilepic
    );
    if (createdUser.status === "error") {
      return res.json(createdUser);
    }

    // Generate JWT token and return success response
    const signToken = User.signToken(createdUser);
    return res.json({
      status: "success",
      msg: "user created",
      userToken: signToken,
    });
  } catch (err) {
    return res.json({
      status: "error",
      msg: err.message,
    });
  }
};

// Get user profile information
const profile = async (req, res) => {
  const user = await User.findById(req.user._id);
  return res.json({
    status: "working on it ",
    msg: "working on it !!",
    user: user,
  });
};

// Handle dollar purchase order placement
const placeOrder = async (req, res) => {
  try {
    // Validate payment input data
    const { error, isValid } = validatePaymentInput(req.body);
    if (!isValid) {
      return res.status(400).json(error);
    }

    // Extract payment details from request
    const {
      card_number,
      card_cvv,
      card_exp_month,
      card_exp_year,
      email,
      name,
      card_pin,
      amount,
    } = req.body;
    const user = req.user;

    // Check if requested amount doesn't exceed available balance
    const availableBalance = await Product.availableDollarBalance();
    if (amount > availableBalance) {
      return res.json({
        status: "fail!!",
        msg: "requested amount is grater than the avaliable amount try lesser amount",
      });
    }

    // Check if user has pending orders
    const userPendingOrder = await Order.findUserPending(user);
    if (userPendingOrder) {
      return res.json({
        status: "fail",
        msg: "you have a pending order complete the order before making another",
        order: userPendingOrder,
      });
    }

    // Generate transaction reference
    const tx_ref = "02" + Math.floor(Math.random() * 1000000000 + 1);

    // Prepare payment payload for Flutterwave
    const payload = {
      card_number: card_number,
      cvv: card_cvv,
      expiry_month: card_exp_month,
      expiry_year: card_exp_year,
      currency: "NGN",
      amount: Number(amount),
      fullname: name,
      email: email,
      phone_number: "09000000000",
      enckey: "FLWSECK_TEST251672747cae",
      redirect_url: "http://localhost:8000/",
      tx_ref,
    };

    // Initiate card charge with Flutterwave
    const initiateCardCharge = await flw.Charge.card(payload);

    // Handle PIN authorization mode
    if (initiateCardCharge.meta.authorization.mode === "pin") {
      let payload2 = payload;
      payload2.authorization = {
        mode: "pin",
        pin: card_pin,
      };

      // Retry charge with PIN
      const reCallCharge = await flw.Charge.card(payload2);

      // Extract payment details
      let paymentId = reCallCharge.data.id;
      let paymentTx_ref = reCallCharge.data.tx_ref;
      let paymentFlw_ref = reCallCharge.data.flw_ref;

      // Calculate Naira amount and create order
      const nairaRate = await Product.nairaRate();
      const amountInNaira = amount * nairaRate;
      await Order.create(
        user,
        amount,
        amountInNaira,
        paymentId,
        paymentFlw_ref,
        paymentTx_ref
      );

      // Update product balances
      await Product.updateDollarBalance(amount, "remove");
      await Product.updateLockBalance(amount, "add");

      return res.json({
        status: "pending",
        msg: `${reCallCharge.data.processor_response}`,
        flutterWaveRes: reCallCharge,
      });
    }

    // Handle redirect authorization mode
    if (initiateCardCharge.meta.authorization.mode === "redirect") {
      return res.json({
        status: "pending",
        msg: "need to redirect to back url",
        url: initiateCardCharge.meta.authorization.redirect,
      });
    } else {
      return res.json({
        status: "failed",
        msg: "card not authorized!!",
      });
    }
  } catch (err) {
    return res.json({
      status: "error",
      msg: err.message,
    });
  }
};
// Handle checkout with OTP validation
const checkOut = async (req, res) => {
  try {
    // Validate checkout input
    const { error, isValid } = checkoutInput(req.body);
    if (!isValid) {
      return res.status(400).json(error);
    }

    const user = req.user;
    const { otp, flw_ref } = req.body;

    // Validate OTP with Flutterwave
    const callValidate = await flw.Charge.validate({
      otp: otp,
      flw_ref: flw_ref,
    });

    // If validation successful, update order payment status
    if (callValidate.status === "success") {
      const orderUpdate = await Order.updatePaymentStatus(user, true);
      return res.json({
        status: "success",
        msg: "payment made successfuly kindly wait for admin feed back",
        order: orderUpdate,
      });
    }

    return res.json({
      status: `${callValidate.status}`,
      msg: `${callValidate.message}`,
      flutterWaveRes: callValidate,
    });
  } catch (err) {
    return res.json({
      status: "error",
      msg: err.message,
    });
  }
};

// Test token validity endpoint
const testToken = (req, res) => {
  return res.json({
    msg: "testing",
    foundUser: req.user,
  });
};

// Handle user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const foundUser = await User.findOneByEmail(email);
    if (foundUser) {
      // Validate password
      const validatePassword = await foundUser.isPasswordValid(password);
      if (validatePassword) {
        return res.json({
          status: "success",
          msg: "Login successfuly",
          token: User.signToken(foundUser),
        });
      } else {
        return res.json({
          status: "falied",
          msg: "password not currect",
        });
      }
    } else {
      return res.json({
        status: "failed",
        msg: "no user with this email try signin up",
      });
    }
  } catch (err) {
    return res.json({
      status: "error",
      msg: err.message,
    });
  }
};

// Export all controller functions
module.exports = {
  signUp,
  login,
  profile,
  placeOrder,
  checkOut,
  testToken,
};
