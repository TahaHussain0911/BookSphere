const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const handleAuthorize = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new AppError("Not Authorized", StatusCodes.UNAUTHORIZED));
  }
  const token = authorization.split("Bearer ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const userExists = await User.findById(user?.userId).select(
    "+passwordChangedAt"
  );
  const passwordChangeInSeconds = Math.floor(
    new Date(userExists?.passwordChangedAt).getTime() / 1000
  );
  // check if passwordChangedAt in user is greater than iat
  // which is issued at of token
  if (user?.iat < passwordChangeInSeconds) {
    return next(
      new AppError("Password has been recently changed. Please login again!")
    );
  }
  // check if token is not expired
  const currentDate = Date.now();
  if (user.exp < Math.floor(currentDate / 1000)) {
    return next(
      new AppError("Token has been expired", StatusCodes.UNAUTHORIZED)
    );
  }
  req.user = { userId: user?.userId, email: user?.name, role: user?.role };
  next();
});
module.exports = {
  handleAuthorize,
};