const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");

module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.use(cors());
    app.use(passport.initialize());
    // app.use(passport.);

    if (process.env.NODE_ENV === "development") {
        app.use(morgan("dev"));
    }
};
