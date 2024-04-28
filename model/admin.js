const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

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
    timestamps: true,
  }
);

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

adminSchema.method("PasswordValid", async function (Password) {
  try {
    return await bcrypt.compare(Password, this.password);
  } catch (err) {
    throw new Error(err);
  }
});

const admin = mongoose.model("admin", adminSchema);

module.exports = admin;
