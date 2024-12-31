const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const {
  remainingTimeFromCurrent,
  handleOtpGenerate,
} = require("../helper/helper");
const Email = require("../utils/email");
const { otpExpireMilliSeconds } = require("../helper/constant");

const handleSignup = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Email is required!", StatusCodes.CONFLICT));
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError("User already exists!", StatusCodes.CONFLICT));
  }
  const user = await User.create(req.body);
  // while creating user password passwordChangedAt(select:false)
  // keys was also selected
  const { password, otpVerified, passwordChangedAt, ...restUser } =
    user?.toObject();
  const token = user.createToken();
  res.status(StatusCodes.CREATED).json({
    user: restUser,
    token,
  });
});
const handleLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new AppError("Email and Password is required!", StatusCodes.CONFLICT)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Invalid credentials!", StatusCodes.BAD_REQUEST));
  }
  const verifyPasswod = await user.comparePassword(password);
  if (!verifyPasswod) {
    return next(new AppError("Invalid credentials!", StatusCodes.BAD_REQUEST));
  }
  const token = user.createToken();
  const { password: userPass, otpVerified, ...restUser } = user?.toObject();
  res.status(StatusCodes.OK).json({
    user: restUser,
    token,
  });
});
const handleOtpSend = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", StatusCodes.BAD_REQUEST));
  }
  const user = await User.findOne({ email }).select("+otpExpiresAt +otp");

  if (!user) {
    return next(new AppError("User doesnot exists!", StatusCodes.NOT_FOUND));
  }
  await user.generateOtp(next);
  await user.save();
  return res.status(StatusCodes.OK).json({
    msg: "Otp send to your email!",
  });
});
const handleVerifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return next(
      new AppError("Email and otp are required!", StatusCodes.BAD_REQUEST)
    );
  }
  const user = await User.findOne({ email }).select(
    "+otp +otpExpiresAt +otpVerified"
  );
  if (!user) {
    return next(
      new AppError("User with this email not exists!", StatusCodes.NOT_FOUND)
    );
  }
  if (user.otpVerified) {
    return next(
      new AppError(
        "You have already verified your OTP. You can reset your password now.",
        StatusCodes.CONFLICT
      )
    );
  }
  if (!user?.otp || !user?.otpExpiresAt) {
    return next(new AppError("No otp requested!", StatusCodes.BAD_REQUEST));
  }
  const otpExpiryInMilliseconds = new Date(user?.otpExpiresAt).getTime();
  if (otpExpiryInMilliseconds < Date.now()) {
    return next(
      new AppError(
        "Your otp code has expired. Request another!",
        StatusCodes.BAD_REQUEST
      )
    );
  }
  if (user?.otp !== otp) {
    return next(new AppError("Invalid otp code!", StatusCodes.BAD_REQUEST));
  }
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  user.otpVerified = true;
  await user.save();
  res.status(StatusCodes.OK).json({
    msg: "Otp Verified successfully!",
  });
});
const handleResendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Email is required!", StatusCodes.BAD_REQUEST));
  }
  const user = await User.findOne({ email }).select("+otpExpiresAt");
  if (!user) {
    return next(new AppError("User doesnot exists!", StatusCodes.NOT_FOUND));
  }
  if (!user?.otpExpiresAt) {
    return next(
      new AppError(
        "Request for otp first before resending code!",
        StatusCodes.BAD_REQUEST
      )
    );
  }
  await user.generateOtp(next);
  await user.save();
  return res.status(StatusCodes.OK).json({
    msg: "Otp send to your email!",
  });
});
const handleResetPassword = catchAsync(async (req, res, next) => {
  const { email, newPassword, confirmNewPassword } = req.body;
  if (!email || !newPassword) {
    return next(
      new AppError("Email and password is required!", StatusCodes.BAD_REQUEST)
    );
  }
  const user = await User.findOne({ email }).select(
    "+password +passwordChangedAt +otpVerified"
  );
  if (!user) {
    return next(new AppError("User doesnot exists!", StatusCodes.NOT_FOUND));
  }
  if (newPassword?.length < 8) {
    return next(
      new AppError(
        "Password should be atleast 8 characters!",
        StatusCodes.BAD_REQUEST
      )
    );
  }
  if (newPassword !== confirmNewPassword) {
    return next(new AppError("Passwords donot match", StatusCodes.CONFLICT));
  }
  if (!user.otpVerified) {
    return next(new AppError("Otp Not Verified", StatusCodes.BAD_REQUEST));
  }
  user.password = newPassword;
  user.otpVerified = false;

  await user.save();
  return res.status(StatusCodes.OK).json({
    msg: "Your password has been reset!",
  });
});
module.exports = {
  handleLogin,
  handleSignup,
  handleOtpSend,
  handleVerifyOtp,
  handleResendOtp,
  handleResetPassword,
};
