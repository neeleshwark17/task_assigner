//User controller
require("dotenv").config();
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAD9-R0byZdB3-Q6r82n2z9qLEzl9ZxcnQ",
  authDomain: "taskassigner-1554b.firebaseapp.com",
  projectId: "taskassigner-1554b",
  storageBucket: "taskassigner-1554b.appspot.com",
  messagingSenderId: "496338878383",
  appId: "1:496338878383:web:d58df784e7286a4ad7395a",
  measurementId: "G-8Y1ZLKEFZK",
};

firebase.initializeApp(firebaseConfig);

const fetch = require("node-fetch");

// Cloud firestore
const bcrypt = require("bcrypt");
const saltRounds = 9;
const admin = require("firebase-admin");
const serviceAccount = require("../user/taskassigner-1554b-firebase-adminsdk-3jo95-95dedc55af.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const jwt = require("jsonwebtoken");
// const passport=require('passport')
// const initializePassport = require("../../passport-config");
// initializePassport(passport)

//function to create jwt
const maxAge = 60 * 30;
function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
}

exports.homeGet = (req, res) => {
  res.render("home", { title: "Home", name: "Neeleshwar" });
};

exports.login = (req, res) => {
  res.render("login", { title: "LoginPage" });
};

exports.signUp = (req, res) => {
  res.render("signUp", { title: "SignUp" });
};

exports.dataPage = (req, res) => {
  res.render("dataPage", { title: "AboutUs" });
};
exports.about = (req, res) => {
  res.render("about", { title: "DataPage" });
};

exports.signUpWithGoogle = (req, res) => {
  let email = req.body.emailEntered;
  let password = req.body.passwordEntered;
  console.log("Google SignUp");
};
exports.signInWithGoogle = (req, res) => {
  // const idToken = JSON.stringify(req.body.idToken);
  // const expiresIn = 60 * 60 * 1000;
  // admin
  //   .auth()
  //   .createSessionCookie(idToken, { expiresIn })
  //   .then(
  //     (sessionCookie) => {
  //       let options = { maxAge: expiresIn, httpOnly: true };
  //       res.cookie("session", sessionCookie, options);
  //       res.end(JSON.stringify({ status: "success" }));
  //     },
  //     (error) => {
  //       res.status(401).send("UNAUTHRIZED REQUEST!");
  //     }
  //   );
};

exports.signInWithEmail = (req, res) => {
  let email = req.body.emailEntered;
  let password = req.body.passwordEntered;

  console.log("Google Login");
  console.log(email);
  console.log(password);

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredentials) => {
      try {
        console.log("CREDS:-" + userCredentials.user);
        const idToken = firebase.auth().currentUser.getIdToken();
        console.log("TOKEN======" + idToken);

        const token = createToken(email);
        res.cookie("jwtLogin", token, {
          maxAge: 1000 * 60 * 30,
          httpOnly: true,
          secure: false,
        });

        res
          .status(200)
          .render("index", { title: "Home", userCred: userCredentials });
      } catch (e) {
        console.log(e);
        res.render("login", {
          title: "Login",
        });
      }
    })
    .catch((error) => {
      console.log("Error while signUp:-" + error);
      res.render("login", { title: "Login", errMsg: "Failed!" });
    });
};
exports.signUpWithEmail = (req, res) => {
  let name = req.body.userName;
  let phone = req.body.userPhone;
  let email = req.body.userEmail;
  let password = req.body.userPassword;
  let confirmPassword = req.body.userConfirmPassword;

  console.log("Email signUp");

  if (password == confirmPassword) {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log("errors-----" + err);
      } else {
        console.log("Hash generated" + hash);

        //create user with email and password ----EMAIL SIGN UP
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((userCredentials) => {
            try {
              let obj = {
                name: name,
                phone: phone,
                email: email,
                password: hash,
              };
              console.log("User Cred-:" + userCredentials);
              db.collection("usersCollection")
                .doc(email)
                .set(obj)
                .then(() => {
                  console.log("Successfully created and stored data");
                  res.render("login", { msg: "Login to continue" });
                });
            } catch (e) {
              console.log(e);
            }
          })
          .catch((error) => {
            console.log("Error while signUp" + error);
          });
      }
    });
  } else {
    console.log("Passwords didn't match");
  }
};

// exports.sigIn = (req, res) => {
//   //check if data already exists
//   let usersCollection = db.collection("userCollection").doc(email);
//   const doc = await usersCollection.get();
//   if (doc) {
//     console.log("USER ALREADY EXISTS");
//   } else {
//     console.log("Storing New user");
//   }
// };
