const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/appError");

const handleDuplicateFields = (err, req, res) => {
  const errorMsg = err?.errorResponse?.errmsg || err?.errmsg;

  const errValue = errorMsg?.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${errValue}. Please use another value`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleValidateError = (err) => {
  console.log(Object.values(err), "validate err");

  const errors = Object.values(err.errors).map((er) => er.message);
  const message = `Invalid data: ${errors.join(". ")}`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};
const handleJWTInvalid = () => {
  return new AppError("Invalid Token! Login again", StatusCodes.UNAUTHORIZED);
};
const globalErrorHandler = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err?.message,
      });
    }
  }
  if (err.isOperational) {
    console.log(err, "err operational");

    return res.status(err.statusCode).json({
      title: "Something went wrong!",
      msg: err.message,
    });
  }
  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;
  if (error.code === 11000) {
    console.log(error, "err operational");
    error = handleDuplicateFields(error);
  }
  if (error.name === "ValidationError") {
    error = handleValidateError(error);
  }
  if (error.name === "JsonWebTokenError") {
    error = handleJWTInvalid();
  }
  globalErrorHandler(error, req, res);
};
