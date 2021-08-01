require("dotenv").config();
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
const admin = require("firebase-admin");
const db = admin.firestore();

const jwt = require("jsonwebtoken");
const requireAuth = function (req, res, next) {
  const token = req.cookies.jwtLogin;

  if (!token || token == null) res.redirect("/login");
  else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) throw err;
      else {
        // console.log(decodedToken);
        next();
      }
    });
  }
};

//check current user
const checkCurrentUser = (req, res, next) => {
  const token = req.cookies.jwtLogin;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.table("CHECK USER ERROR", err.message);
        res.locals.user = null;
        next();
      } else {
        console.log("decoded jwt token->", decodedToken, decodedToken.id);
        //find the user by id decodedToken

        let user = await db
          .collection("usersCollection")
          .doc(`${decodedToken.id}`)
          .get();

        console.log("doc------->", user);
        res.locals.user = user.data().name;
        console.log("LOCALS SET------->", res.locals.user);
        next();
      }
    });
  } else {
    console.log("ELSE STATEMENT MIDDLEWARE");
    res.locals.user = null;
    next();
  }
};
const checkUserLoggedIn = (req, res, next) => {
  const token = req.cookies.jwtLogin;
  if (token) {
    jwt.verify(token,process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log('token not verified in logged in check')
        next();
      } else {
        console.log("tokenGOT");
        res.redirect("/");
      }
    });
  } else {
    console.log("token NOTHING`");
    next();
  }
};

module.exports = { requireAuth, checkCurrentUser, checkUserLoggedIn };
