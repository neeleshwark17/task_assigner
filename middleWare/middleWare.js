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
        
        let doc =  db.collection("usersCollection").doc(`${decodedToken.id}`)
        let user = await doc.get();

        console.log("doc------->", user);

        if (!user.exists) {
          console.log("No such document!");
        } else {
          console.log("Document data:", user.data().name);
        }

        res.locals.user = user.data().name;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkCurrentUser };
