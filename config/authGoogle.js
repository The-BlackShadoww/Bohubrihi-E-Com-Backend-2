const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const _ = require("lodash");
const { User } = require("../models/user");

const strategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
            "https://bohubrihi-e-com-backend-app-2.onrender.com/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, cb) => {
        console.log("This is the user profile => ", profile);

        let user = await User.findOne({
            googleId: profile.id,
            email: profile._json.email,
        });

        if (user) {
            const token = user.generateJWT();

            const response = {
                user: _.pick(user, ["email", "_id"]),
                token: token,
            };

            cb(null, response);

            console.log("User exists :", user);
        } else {
            user = new User({
                googleId: profile.id,
                email: profile._json.email,
                name: profile.displayName,
            });

            await user.save();

            const token = user.generateJWT();

            const response = {
                user: _.pick(user, ["email", "_id"]),
                token: token,
            };

            cb(null, response);

            console.log("This is new user => ", user);
        }
    }
);
passport.use(strategy);

//! ---------------- Active ----------------

// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const _ = require("lodash");
// const { User } = require("../models/user");

// const strategy = new GoogleStrategy(
//     {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: "http://localhost:3001/auth/google/redirect",
//     },
//     async (accessToken, refreshToken, profile, cb) => {
//         console.log("This is the user profile => ", profile);

//         let user = await User.findOne({
//             googleId: profile.id,
//             email: profile._json.email,
//         });

//         if (user) {
//             const token = user.generateJWT();

//             const response = {
//                 user: _.pick(user, ["email", "_id"]),
//                 token: token,
//             };

//             cb(null, response);

//             console.log("User exists :", user);
//         } else {
//             user = new User({
//                 googleId: profile.id,
//                 email: profile._json.email,
//                 name: profile.displayName,
//             });

//             await user.save();

//             const token = user.generateJWT();

//             const response = {
//                 user: _.pick(user, ["email", "_id"]),
//                 token: token,
//             };

//             cb(null, response);

//             console.log("This is new user => ", user);
//         }
//     }
// );

// // passport.serializeUser((user, done) => {
// //     done(null, user.id);
// // });

// // passport.deserializeUser((id, done) => {
// //     User.findById(id, (err, user) => done(err, user));
// // });

// passport.use(strategy);
