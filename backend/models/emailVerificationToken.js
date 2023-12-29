const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const emailVerificationTokenSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
});
emailVerificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});
// emailVerificationTokenSchema.methods.compareToken = async function (
//   candidateToken
// ) {
//   const result = await bcrypt.compare(candidateToken, this.token);
//   return result;
// };
emailVerificationTokenSchema.methods.compareToken = async function (token) {
  const result = await bcrypt.compare(token, this.token);
  return result;
};
// verificationToken: {
//   owner: _id,
//   token: "otp",
//   expiryDate: "1 hr",
// };

module.exports = mongoose.model(
  "emailVerificationTokenToken",
  emailVerificationTokenSchema
);
