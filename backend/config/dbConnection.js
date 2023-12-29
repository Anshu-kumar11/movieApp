const mongoose = require("mongoose");
const dbConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("connection successfull");
    })
    .catch((err) => {
      console.log("error during connection", err);
    });
};
module.exports = dbConnect;
