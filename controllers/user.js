const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

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
    return next(new AppError("Invalid credentials!", StatusCodes.UNAUTHORIZED));
  }
  const verifyPasswod = await user.comparePassword(password);
  if (!verifyPasswod) {
    return next(new AppError("Invalid credentials!", StatusCodes.UNAUTHORIZED));
  }
  const token = user.createToken();
  const { password: userPass, otpVerified, ...restUser } = user?.toObject();
  res.status(StatusCodes.OK).json({
    user: restUser,
    token,
  });
});
module.exports = {
  handleLogin,
  handleSignup,
};
