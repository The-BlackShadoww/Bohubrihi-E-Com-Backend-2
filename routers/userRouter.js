const router = require("express").Router();
const authorize = require("../middlewares/authorize");
const {
    signUp,
    signIn,
    signInFailed,
    signInSuccessful,
    getUserHistory,
} = require("../controllers/userController");

router.route("/signup").post(signUp);

router.route("/signin").post(signIn);

router.route("/history").get(authorize, getUserHistory);

module.exports = router;
