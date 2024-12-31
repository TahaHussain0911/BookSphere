const mongoose = require("mongoose");
const { email_regex } = require("../utils/regex");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { handleOtpGenerate } = require("../helper/helper");
const { otpExpireMilliSeconds } = require("../helper/constant");
const Email = require("../utils/email");
const { StatusCodes } = require("http-status-codes");
const UserModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      minLength: 3,
      trim: true,
    },
    photo: {
      type: String,
      default: "default-user.png",
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      match: [email_regex, "Please provide valid email"],
      unique: true,
    },
    password: {
      type: String,
      minLength: 8,
      required: [true, "Password is required!"],
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    otp: {
      type: String,
      select: false,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    otpExpiresAt: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      default: "User",
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);
UserModel.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordChangedAt = new Date();
  }
  next();
});

UserModel.methods.createToken = function () {
  const token = jwt.sign(
    {
      userId: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_AT,
    }
  );
  return token;
};
UserModel.methods.comparePassword = async function (inputPass) {
  return await bcrypt.compare(inputPass, this.password);
};
UserModel.methods.generateOtp = async function (next) {
  const otpExpiry = new Date(this.otpExpiresAt).getTime();

  if (this.otpExpiresAt && otpExpiry > Date.now()) {

    const remainingTime = Math.ceil((otpExpiry - Date.now()) / 1000);
    const seconds = remainingTime % 60;
    const minutes = Math.floor(remainingTime / 60);
    return next(
      new AppError(
        `Otp already sent. Please wait ${
          minutes ? `${minutes} mins and ` : ""
        } ${seconds} seconds before requesting for another!`,
        StatusCodes.CONFLICT
      )
    );
  }
  const otp = handleOtpGenerate();
  const payload = {
    msg: `Your confirmation code is ${otp}`,
  };
  await new Email(this).sendOtpCode(payload);
  this.otp = otp;
  this.otpExpiresAt = new Date(Date.now() + otpExpireMilliSeconds);
};
module.exports = mongoose.model("User", UserModel);
