const Admin = require("../model/admin.js");
const { jwt_secret } = require("../config/keys.js");
const jwt = require("jsonwebtoken");

const create = async (firstname, lastname, email, password) => {
  try {
    const admin = await Admin.create({
      firstname,
      lastname,
      email,
      password,
    });
    let foundAdmin = {
      _id: admin._id,
      firstname: admin.firstname,
      lastname: admin.lastname,
      email: admin.email,
    };
    return foundAdmin;
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
const findOneByEmail = async (email) => {
  try {
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      const noAdmin = {
        status: "error",
        msg: "no Admin found",
      };
      return noAdmin;
    }

    return admin;
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};
const findById = async (id) => {
  try {
    const user = await Admin.findById(id);
    if (!user) {
      const noAdmin = {
        status: "error",
        msg: "no Admin found",
      };
      return noAdmin;
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
module.exports = {
  create,
  signToken,
  findOneByEmail,
  findById,
};
