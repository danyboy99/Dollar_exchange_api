// Import required packages
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("./keys.js");
const User = require("../services/user.js");
const Admin = require("../services/admin.js");

// Middleware to validate user JWT token
const signUser = async (req, res, next) => {
  try {
    // Get authorization token from headers
    const { authorization } = req.headers;

    // Verify and decode the JWT token
    const decoded = jwt.verify(authorization, jwt_secret);
    const foundId = decoded.user;

    // Find user by ID from token
    const foundUser = await User.findById(foundId);

    // Check if user ID has error status
    if (foundId.status == "error") {
      return res.json({
        status: "failed!",
        msg: "user not authorize",
      });
    }

    // If user exists, attach to request and continue
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

// Middleware to validate admin JWT token
const signAdmin = async (req, res, next) => {
  try {
    // Get authorization token from headers
    const { authorization } = req.headers;

    // Verify and decode the JWT token
    const decoded = jwt.verify(authorization, jwt_secret);
    const foundId = decoded.user;

    // Find admin by ID from token
    const foundUser = await Admin.findById(foundId);

    // If admin exists, attach to request and continue
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

// Export middleware functions
module.exports = {
  signUser,
  signAdmin,
};
