// Import required modules
const User = require("../model/user.js");
const { jwt_secret } = require("../config/keys.js");
const jwt = require("jsonwebtoken");

// Find user by ID and return formatted user data
const findById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return false;
    }

    // Return formatted user object
    let foundUser = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      username: user.username,
      profilePic: user.profilePic || "",
    };
    return foundUser;
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};

// Find user by email address
const findOneByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};

// Create new user account
const create = async (
  firstname,
  lastname,
  username,
  email,
  password,
  profilePic
) => {
  try {
    // Create user in database
    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      password,
      profilePic,
    });

    // Return formatted user object
    let foundUser = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      username: user.username,
      profilePic: user.profilePic || "",
    };
    return foundUser;
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};

// Generate JWT token for user authentication
const signToken = (user) => {
  const payload = {
    user: user._id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2 hours expiration
  };
  return jwt.sign(payload, jwt_secret);
};

// Export all user service functions
module.exports = {
  findById,
  findOneByEmail,
  create,
  signToken,
};
