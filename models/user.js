const mongoose = require("mongoose");
const { email_regex } = require("../utils/regex");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
      required:[true,"Password is required!"],
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

module.exports = mongoose.model("User", UserModel);
