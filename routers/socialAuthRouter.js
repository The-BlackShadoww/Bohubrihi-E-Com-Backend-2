const router = require("express").Router();
const passport = require("passport");
require("../config/authGoogle");

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

module.exports = router;
