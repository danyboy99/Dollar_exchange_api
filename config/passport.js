const jwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const localStrategy = require("passport-local").Strategy;
const User = require("../services/user.js");
const Admin = require("../services/admin.js");
const { jwt_secret } = require("../config/keys.js");

const passportConfig = (passport) => {
  //user login strategy
  passport.use(
    "userLogin",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          //find user with the given email
          const user = await User.findOneByEmail(email);
          if (!user) {
            return done(null, false);
          }
          const validatePassword = await user.isPasswordValid(password);
          if (!validatePassword) {
            return done(null, false);
          }
          //otherwise return user
          done(null, user);
        } catch (err) {
          done(err, false);
        }
      }
    )
  );
  //user auth strategy
  passport.use(
    "validateUser",
    new jwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwt_secret,
      },
      async (payload, done) => {
        try {
          //find user in token
          const currentUser = await User.findById(payload.sub);
          //if user doesn't exist, handle it
          if (!currentUser) {
            return done(null, false);
          }
          //otherwise, return the user

          done(null, currentUser);
        } catch (err) {
          done(err.message, false);
        }
      }
    )
  );
  //admin login startegy
  passport.use(
    "adminLogin",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          //find admin with the given email
          const admin = await Admin.findOneByEmail(email);
          if (admin.status === "error") {
            return done(admin.msg, false);
          }
          //validate password
          const validatePassword = await admin.PasswordValid(password);
          console.log("got to validate", validatePassword);
          if (!validatePassword) {
            done(null, false);
          }
          //otherwise return admin
          done(null, admin);
        } catch (err) {
          done(err, false);
        }
      }
    )
  );
  //admin validate strategy
  passport.use(
    "adminValidate",
    new jwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwt_secret,
      },
      async (payload, done) => {
        try {
          //find user in token
          const currentAdmin = await Admin.findById(payload.sub);
          //if user doesn't exist, handle it
          if (!currentAdmin) {
            return done(null, false);
          }
          //otherwise, return the user

          done(null, currentAdmin);
        } catch (err) {
          done(err.message, false);
        }
      }
    )
  );
};
module.exports = passportConfig;
