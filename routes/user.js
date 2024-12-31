const express = require("express");
const router = express.Router();
const {
  handleLogin,
  handleSignup,
  handleOtpSend,
} = require("../controllers/user");

router.post("/login", handleLogin).post("/signup", handleSignup);
router.post("/send-otp", handleOtpSend);
module.exports = router;
