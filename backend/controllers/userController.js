const express = require("express");
const User = require("../models/userModel");
const crypto = require("crypto");
const EmailVerificationTokenToken = require("../models/emailVerificationToken");
const bcrypt = require("bcrypt");
const { isValidObjectId } = require("mongoose");
const emailVerificationToken = require("../models/emailVerificationToken");
const passwordModel = require("../models/passwordModel");
exports.create = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for duplicate user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    // const newUser = new User({ name, email, password: hashedPassword });
    const newUser = new User({ name, email, password });

    // Save user info in the database
    await newUser.save();

    // Generate OTP
    let otp = "";
    for (let i = 0; i < 6; i++) {
      const randomVal = Math.round(Math.random() * 9);
      otp += randomVal;
    }

    // Store OTP inside the database
    const newEmailVerificationToken = new EmailVerificationTokenToken({
      owner: newUser._id,
      token: otp,
    });
    await newEmailVerificationToken.save();

    // Send verification email
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "210d0e03916765",
        pass: "cd93698f4643c2",
      },
    });

    transport.sendMail(
      {
        from: "anshukr4290@gmail.com",
        to: newUser.email,
        subject: "Email Verification",
        html: `<p>This is your verification token:</p><p>${otp}</p>`,
      },
      (error, info) => {
        if (error) {
          // console.error("Error sending email:", error);
        } else {
          // console.log("Email sent:", info);
        }
      }
    );

    // Respond to the client
    res.status(201).json({
      success: true,
      message: "User created successfully. Please verify your email.",
      user: newUser,
    });
  } catch (error) {
    console.error("Error in create userController:", error);
    res.status(500).json({
      success: false,
      message: "User not created!",
    });
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    if (!isValidObjectId(userId)) return res.json({ error: "invalid user" });

    const user = await User.findById(userId);
    if (!user) return res.json({ error: "user not found" });

    if (user.isVerified) return res.json({ error: "user is already verified" });

    const token = await EmailVerificationTokenToken.findOne({ owner: userId });

    if (!token) return res.json({ error: "token not found" });

    const isMatched = await token.compareToken(otp);
    if (!isMatched) {
      return res.json({ error: "please submit a valid otp" });
    }

    user.isVerified = true;
    await user.save();

    await EmailVerificationTokenToken.findByIdAndDelete(token._id);

    var transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "f29ed41f1f4bd3",
        pass: "db3edd88e2927f",
      },
    });

    transport.sendMail({
      from: "anshukr4290@gmail.com",
      to: user.email,
      subject: "welcome to email",
      html: "<h1>welcome to our app</h1>",
    });
    res.json({
      message: "your email is verified",
    });
  } catch (err) {
    return res.status(5000).json({
      err: "email is not verified",
    });
  }
};

exports.resendEMailVerificationToken = async (req, res) => {
  try {
    const { userId } = req.body;
    // console.log(userId);

    const user = await User.findById(userId);
    // console.log(user);
    if (!user) {
      return res.status(404).json({
        error: "user not found",
      });
    }
    if (user.isVerified) {
      return res.status.json({
        error: "this email id is already verified",
      });
    }
    // console.log("user verified");
    const alreadyHasToken = await EmailVerificationTokenToken.findOne({
      owner: userId,
    });
    if (alreadyHasToken) {
      return res.status(400).json({
        error: "after one hour you are eligible for another token",
      });
      0;
    }
    let otp = "";
    for (let i = 0; i <= 5; i++) {
      const randomVal = Math.round(Math.random() * 9);
      otp += randomVal;
    }
    // store otp inside db
    const newEmailVerificationToken = new EmailVerificationTokenToken({
      owner: user._id,
      token: otp,
    });
    await newEmailVerificationToken.save();
    var transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "f29ed41f1f4bd3",
        pass: "db3edd88e2927f",
      },
    });
    transport.sendMail({
      from: "anshukr4290@gmail.com",
      to: user.email,
      subject: "Email Verification",
      html: `
      <p>You verification OTP</p>
      <h1>${otp}</h1>
    `,
    });
    res.json({
      message: "New OTP has been sent to your registered email accout.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err: "your mail verification token is not verified",
    });
  }
};

exports.forgetPAssword = async (res, req) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendError(res, "email is missing");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "user not found", 404);
    }
    const alreadyHAsToken = await passwordModel.findOne({ owner: user._id });
    if (alreadyHAsToken) {
      return sendError(
        res,
        "only after one hour you can request for another token"
      );
    }
    crypto.randomBytes(30, e);
  } catch (err) {}
};
