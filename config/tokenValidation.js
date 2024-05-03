const jwt = require("jsonwebtoken");
const { jwt_secret } = require("./keys.js");
const User = require("../services/user.js");
const Admin = require("../services/admin.js");
const signUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const decoded = jwt.verify(authorization, jwt_secret);
    const foundId = decoded.user;
    const foundUser = await User.findById(foundId);
    if (foundId.status == "error") {
      return res.json({
        status: "failed!",
        msg: "user not authorize",
      });
    }
    if (foundUser) {
      req.user = foundUser;
      return next();
    } else {
      return res.json({
        status: "failed!",
        msg: "user not authorize",
      });
    }
  } catch (err) {
    return res.json({
      status: "fail",
      msg: err.message,
    });
  }
};
const signAdmin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const decoded = jwt.verify(authorization, jwt_secret);
    console.log(decoded);
    const foundId = decoded.user;
    const foundUser = await Admin.findById(foundId);
    if (foundUser) {
      req.user = foundUser;
      return next();
    } else {
      return res.json({
        status: "failed!",
        msg: "user not authorize",
      });
    }
  } catch (err) {
    return res.json({
      status: "fail",
      msg: err.message,
    });
  }
};
module.exports = {
  signUser,
  signAdmin,
};
