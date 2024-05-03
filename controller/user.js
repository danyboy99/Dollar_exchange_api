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
const flw = new flutterWave(flutterwavePublicKey, flutterwaveSecretKey);
const signUp = async (req, res) => {
  try {
    const { firstname, lastname, username, email, profilepic, password } =
      req.body;
    const { error, isValid } = validateSignupInput(req.body);
    // check validation
    if (!isValid) {
      return res.status(400).json(error);
    }
    const userAlreadyExist = await User.findOneByEmail(email);
    if (userAlreadyExist) {
      return res.json({
        status: "Fail!!",
        msg: "user already exist with this email try Login",
      });
    }

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

const profile = async (req, res) => {
  const user = await User.findById(req.user._id);
  return res.json({
    status: "working on it ",
    msg: "working on it !!",
    user: user,
  });
};
const placeOrder = async (req, res) => {
  try {
    const { error, isValid } = validatePaymentInput(req.body);
    // check validation
    if (!isValid) {
      return res.status(400).json(error);
    }
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
    //check if the requested amount is not more than the available balance
    const availableBalance = await Product.availableDollarBalance();
    if (amount > availableBalance) {
      return res.json({
        status: "fail!!",
        msg: "requested amount is grater than the avaliable amount try lesser amount",
      });
    }
    // check if user have a pending order
    const userPendingOrder = await Order.findUserPending(user);
    if (userPendingOrder) {
      return res.json({
        status: "fail",
        msg: "you have a pending order complete the order before making another",
        order: userPendingOrder,
      });
    }
    const tx_ref = "02" + Math.floor(Math.random() * 1000000000 + 1);
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

    const initiateCardCharge = await flw.Charge.card(payload);

    if (initiateCardCharge.meta.authorization.mode === "pin") {
      let payload2 = payload;
      payload2.authorization = {
        mode: "pin",
        pin: card_pin,
      };
      const reCallCharge = await flw.Charge.card(payload2);
      //if failed

      let paymentId = reCallCharge.data.id;
      let paymentTx_ref = reCallCharge.data.tx_ref;
      let paymentFlw_ref = reCallCharge.data.flw_ref;
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
      await Product.updateDollarBalance(amount, "remove");
      await Product.updateLockBalance(amount, "add");
      return res.json({
        status: "pending",
        msg: `${reCallCharge.data.processor_response}`,
        flutterWaveRes: reCallCharge,
      });
    }

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
const checkOut = async (req, res) => {
  try {
    const { error, isValid } = checkoutInput(req.body);
    // check validation
    if (!isValid) {
      return res.status(400).json(error);
    }
    const user = req.user;
    const { otp, flw_ref } = req.body;
    const callValidate = await flw.Charge.validate({
      otp: otp,
      flw_ref: flw_ref,
    });

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
const testToken = (req, res) => {
  return res.json({
    msg: "testing",
    foundUser: req.user,
  });
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOneByEmail(email);
    if (foundUser) {
      const validatePassword = await foundUser.isPasswordValid(password);
      console.log("isPasswordValid:", validatePassword);
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
module.exports = {
  signUp,
  login,
  profile,
  placeOrder,
  checkOut,
  testToken,
};
