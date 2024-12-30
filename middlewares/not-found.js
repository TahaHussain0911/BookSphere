const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/appError");
const routeNotFound = (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
};
module.exports = routeNotFound;
