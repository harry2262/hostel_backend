import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Your name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email address"],
    unique: true,
    validate: [isValidEmail, "Please enter valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Your password must have at least 6 characters"],
  },
  sem: {
    type: Number,
    // required: [true, "Please enter your semester"],
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
  },
  roomNumber: {
    type: String,
  },
  year: {
    type: Number,
    // required: [true, "Please enter your year"],
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// Encrypting password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// return JSON Web Token(jwt)
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

// Generating password reset token
userSchema.methods.getResetPasswordToken = function () {
  // generate new password reset token from crypto
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the resetToken and assign to user's resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // setting token expire time to 30min
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

function isValidEmail(email) {
  // Define the corrected pattern for the email with the last two digits of the year
  const pattern = /^[a-z]+[a-z]{1}\.[a-z]{2}\.\d{2}@nitj\.ac\.in$/i;

  // Check if the email matches the pattern
  return pattern.test(email.toLowerCase());
}
export default mongoose.model("User", userSchema);
