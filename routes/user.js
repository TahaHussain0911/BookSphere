const express = require("express");
const router = express.Router();
const { handleLogin, handleSignup } = require("../controllers/user");

router.post("/login", handleLogin).post("/signup", handleSignup);
module.exports = router;
