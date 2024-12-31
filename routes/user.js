const express = require("express");
const router = express.Router();
const {
  handleLogin,
  handleSignup,
  handleOtpSend,
  handleVerifyOtp,
  handleResetPassword,
  handleResendOtp,
} = require("../controllers/user");

router.post("/login", handleLogin).post("/signup", handleSignup);

router
  .post("/send-otp", handleOtpSend)
  .post("/resend-otp", handleResendOtp)
  .post("/verify-otp", handleVerifyOtp);

router.patch("/reset-password", handleResetPassword);

module.exports = router;
