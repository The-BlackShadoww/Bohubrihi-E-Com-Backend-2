const router = require("express").Router();
const passport = require("passport");
require("../config/authGoogle");
require("../config/authFaceBook");

//todo ------------ Google Authentication ---------------

// router.get("/login/success", (req, res) => {
//     console.log("This is successful login => ", req.user);
//     if (req.user) {
//         res.status(200).send({
//             success: true,
//             message: "successful",
//             user: req.user,
//             //   cookies: req.cookies
//         });
//     }
// });

router.get("/login/failed", (req, res) => {
    res.status(401).send({
        success: false,
        message: "failure",
    });
});

//* http://localhost:3001/auth/google
router
    .route("/google")
    .get(passport.authenticate("google", { scope: ["profile", "email"] }));

//* http://localhost:3001/auth/google/redirect

const CLIENT_URL = "http://localhost:3000/login";

router.route("/google/redirect").get(
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/login/failed",
        // successRedirect: CLIENT_URL,
    }),
    (req, res) => {
        console.log("The user => ", req.user);
        const token = req.user.token;
        res.redirect(`${CLIENT_URL}?token=${token}`);
    }
);

//todo ------------ FaceBook Authentication ---------------
//* http://localhost:3001/auth/facebook
router.route("/facebook").get(passport.authenticate("facebook"));

//* http://localhost:3001/auth/facebook/redirect
router.route("/facebook/redirect").get(
    passport.authenticate("facebook", {
        session: false,
        failureRedirect: "/login/failed",
    }),
    (req, res) => {
        console.log("The facebook user: ", req.user);
        const token = req.user.token;
        res.redirect(`${CLIENT_URL}?token=${token}`);
    }
);

module.exports = router;
