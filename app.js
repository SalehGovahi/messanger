const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const connectDB = require("./initializer");
const HttpError = require("./utils/http-error");
const mainRoute = require("./services/MainRoute");

connectDB();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

    next();
});

app.use("/api", mainRoute);

app.use((req, res, next) => {
    console.log("hello33");
    const error = new HttpError("Could not find this route.", 404);
    throw error;
});



module.exports = app;