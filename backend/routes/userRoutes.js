const express = require("express");

// const { model } = require("mongoose");
const {
  create,
  verifyEmail,
  resendEMailVerificationToken,
} = require("../controllers/userController");
const { userValidator } = require("../middleware/userMiddleware");
const { validate } = require("../middleware/userMiddleware");
const router = express.Router();
router.post("/create", userValidator, validate, create);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEMailVerificationToken);

module.exports = router;
