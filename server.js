const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.js");
const adminRoutes = require("./routes/admin.js");
const { DB_url } = require("./config/keys.js");
const passport = require("passport");
const passportConfig = require("./config/passport.js");
const cors = require("cors");
const app = express();
//connect to mongoDB with mongoose
mongoose
  .connect(DB_url)
  .then(() => {
    console.log("connected to database!!!");
  })
  .catch((err) => {
    console.log("error:", err.message);
  });
//middlewares
// set cors
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
//initialize passport
app.use(passport.initialize());
passportConfig(passport);
// parse application/json
app.use(express.json());
//routes config
//user routes
app.use("/user", userRoutes);
//admin routes
app.use("/admin", adminRoutes);
const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
