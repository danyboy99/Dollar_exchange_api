const User = require("../model/user.js");
const { jwt_secret } = require("../config/keys.js");
const jwt = require("jsonwebtoken");

const findById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return false;
    }
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

const create = async (
  firstname,
  lastname,
  username,
  email,
  password,
  profilePic
) => {
  try {
    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      password,
      profilePic,
    });
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

const signToken = (user) => {
  const payload = {
    user: user._id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
  };
  return jwt.sign(payload, jwt_secret);
};

module.exports = {
  findById,
  findOneByEmail,
  create,
  signToken,
};
