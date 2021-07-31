var express = require("express");
var router = express.Router();
const admin = require("firebase-admin");


const userController = require("../controllers/user/user_controller");
const adminController = require("../controllers/admin/admin_controller");
const { requireAuth } = require("../middleWare/middleWare");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get('*',(err,result,next)=>{
  next()
})

router.get("/login", userController.login);
router.get("/signUp", userController.signUp);
router.get("/dataPage",requireAuth, userController.dataPage);
router.get("/about",requireAuth, userController.about);
router.get('/home',requireAuth,userController.homeGet)

router.post("/signInWithGoogle", userController.signInWithGoogle);
router.post('/signInWithEmail',userController.signInWithEmail)
router.post("/signUpWithGoogle", userController.signUpWithGoogle);
router.post("/signUpWithEmail", userController.signUpWithEmail);

module.exports = router;
