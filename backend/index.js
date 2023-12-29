const express = require("express");
const dbConnect = require("./config/dbConnection");
const userRoute = require("./routes/userRoutes");
const app = express();
require("dotenv").config();

app.use(express.json());
dbConnect();
app.use("/api/v1/user", userRoute);
const PORT = process.env.PORT || 3000;
// app.post(
//   "/sign-in",
//   (req, res, next) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "please fill mandatory filled",
//       });
//     }
//     next();
//   },

//   (req, res) => {
//     res.send("<h1>hello i am a get request of about page</h1>");
//   }
// );
app.listen(PORT, () => {
  console.log(`port is running on ${PORT}`);
});
