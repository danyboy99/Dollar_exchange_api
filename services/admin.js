// Import required modules
const Admin = require("../model/admin.js");
const { jwt_secret } = require("../config/keys.js");
const jwt = require("jsonwebtoken");

// Create new admin account
const create = async (firstname, lastname, email, password) => {
  try {
    // Create admin in database
    const admin = await Admin.create({
      firstname,
      lastname,
      email,
      password,
    });

    // Return formatted admin object
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

// Generate JWT token for admin authentication
const signToken = (user) => {
  const payload = {
    user: user._id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2 hours expiration
  };
  return jwt.sign(payload, jwt_secret);
};

// Find admin by email address
const findOneByEmail = async (email) => {
  try {
    const admin = await Admin.findOne({ email: email });
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

// Find admin by ID and return formatted admin data
const findById = async (id) => {
  try {
    const user = await Admin.findById(id);
    if (!user) {
      return false;
    }

    // Return formatted admin object
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

// Export all admin service functions
module.exports = {
  create,
  signToken,
  findOneByEmail,
  findById,
};
