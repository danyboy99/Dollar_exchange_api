const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
  },
  username: {
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
  profilePic: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.method("isPasswordValid", async function (Password) {
  try {
    return await bcrypt.compare(Password, this.password);
  } catch (err) {
    throw new Error(err);
  }
});

const user = mongoose.model("user", userSchema);

module.exports = user;
