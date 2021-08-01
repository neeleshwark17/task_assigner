var express = require("express");
var router = express.Router();
const admin = require("firebase-admin");

const userController = require("../controllers/user/user_controller");
const adminController = require("../controllers/admin/admin_controller");
const { requireAuth, checkCurrentUser, checkUserLoggedIn } = require("../middleWare/middleWare");

const userDevice = require("express-device");

router.use(userDevice.capture());

router.get("*", checkCurrentUser);

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log('locals',res.locals.user)
  res.render("index", { title: "Express" });
});

router.get("/login",checkUserLoggedIn, userController.login);
router.get("/signUp", userController.signUp);
router.get("/dataPage", requireAuth, userController.dataPage);
router.get("/about", requireAuth, userController.about);
router.get("/home", requireAuth, userController.homeGet);

router.post("/signInWithGoogle", userController.signInWithGoogle);
router.post("/signInWithEmail", userController.signInWithEmail);
router.post("/signUpWithGoogle", userController.signUpWithGoogle);
router.post("/signUpWithEmail", userController.signUpWithEmail);
router.get("/logOut", userController.logOut);

module.exports = router;
