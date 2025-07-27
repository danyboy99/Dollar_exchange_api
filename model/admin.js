// Import required packages
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

// Define admin schema with timestamps
const adminSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Hash password before saving admin
adminSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (err) {
    next(err);
  }
});

// Method to validate admin password
adminSchema.method("PasswordValid", async function (Password) {
  try {
    return await bcrypt.compare(Password, this.password);
  } catch (err) {
    throw new Error(err);
  }
});

// Create and export admin model
const admin = mongoose.model("admin", adminSchema);

module.exports = admin;
