const otpExpireMilliSeconds = 1000 * 60 * 2;
const fileSize = 5 * 1024 * 1024; // 5MB
const allowedImageTypes = ["png", "jpg", "jfif", "jpeg"];

module.exports = {
  otpExpireMilliSeconds,
  fileSize,
  allowedImageTypes,
};
