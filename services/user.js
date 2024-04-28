const User = require("../model/user.js");
const { jwt_secret } = require("../config/keys.js");
const jwt = require("jsonwebtoken");

const findById = async (id) => {
  try {
    const user = await User.findById(id);
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
    // if (!user) {
    //   const noUser = {
    //     status: "error",
    //     msg: "no user found",
    //   };
    //   return noUser;
    // }

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
  return jwt.sign(
    {
      iss: "Danilo",
      sub: user._id,
      iat: new Date().getTime(), //current time
      exp: new Date().setDate(new Date().getDate() + 1), // current time plus 1 day ahead
    },
    jwt_secret
  );
};

module.exports = {
  findById,
  findOneByEmail,
  create,
  signToken,
};
