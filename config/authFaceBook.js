const passport = require("passport");
const FaceBookStrategy = require("passport-facebook").Strategy;
const _ = require("lodash");
const { User } = require("../models/user");

const strategy = new FaceBookStrategy(
    {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL:
            "https://bohubrihi-e-com-backend-app-2.onrender.com/auth/facebook/redirect",
        profileFields: ["id", "displayName", "photos", "email"],
        scope: ["email"],
    },
    async (accessToken, refreshToken, profile, cb) => {
        console.log("This is facebook profile => ", profile);

        let user = await User.findOne({
            facebookId: profile.id,
            email: profile._json.email,
        });

        if (user) {
            const token = user.generateJWT();

            const response = {
                user: _.pick(user, ["email", "_id"]),
                token: token,
            };

            cb(null, response);

            console.log("Facebook user exists");
        } else {
            user = new User({
                facebookId: profile.id,
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

            console.log("New facebook user created => ", user);
        }
    }
);

passport.use(strategy);

//! ---------- Active --------

// const passport = require("passport");
// const FaceBookStrategy = require("passport-facebook").Strategy;
// const _ = require("lodash");
// const { User } = require("../models/user");

// const strategy = new FaceBookStrategy(
//     {
//         clientID: process.env.FACEBOOK_APP_ID,
//         clientSecret: process.env.FACEBOOK_APP_SECRET,
//         callbackURL: "http://localhost:3001/auth/facebook/redirect",
//         profileFields: ["id", "displayName", "photos", "email"],
//         scope: ["email"],
//     },
//     async (accessToken, refreshToken, profile, cb) => {
//         console.log("This is facebook profile => ", profile);

//         let user = await User.findOne({
//             facebookId: profile.id,
//             email: profile._json.email,
//         });

//         if (user) {
//             const token = user.generateJWT();

//             const response = {
//                 user: _.pick(user, ["email", "_id"]),
//                 token: token,
//             };

//             cb(null, response);

//             console.log("Facebook user exists");
//         } else {
//             user = new User({
//                 facebookId: profile.id,
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

//             console.log("New facebook user created => ", user);
//         }
//     }
// );

// passport.use(strategy);
