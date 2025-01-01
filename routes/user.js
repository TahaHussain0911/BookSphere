const express = require("express");
const router = express.Router();
const {
  handleLogin,
  handleSignup,
  handleOtpSend,
  handleVerifyOtp,
  handleResetPassword,
  handleResendOtp,
  handleGetUser,
  handleUpdateUser,
  handleUpdatePassword,
} = require("../controllers/user");
const { handleAuthorize } = require("../middlewares/authorization");
const upload = require("../middlewares/image-upload");

router.post("/login", handleLogin).post("/signup", handleSignup);

router
  .post("/send-otp", handleOtpSend)
  .post("/resend-otp", handleResendOtp)
  .post("/verify-otp", handleVerifyOtp);

router.patch("/reset-password", handleResetPassword);

router.use(handleAuthorize);

router.get("/me", handleGetUser);
router
  .patch("/update-password", handleUpdatePassword)
  .patch("/update-me", upload.single("photo"), handleUpdateUser);

module.exports = router;
