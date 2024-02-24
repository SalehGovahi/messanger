const User = require("./userModel");
const HttpError = require("../../utils/http-error");
const { log } = require("console");

const checkUserIsExisting = async (email, errorMessage) => {
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        console.log(err);

        const error = new HttpError(errorMessage, 500);
        return next(error);
    }
};

const getUsers = async (req, res, next) => {
    let users;

    try {
        users = await User.find({}, "-password");
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            "Fetching users failed, please try again later.",
            500
        );
        return next(error);
    }

    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    checkUserIsExisting(email, "User exists already, please login instead.");

    const createdUser = new User({
        name,
        email,
        password,
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError("An error accured in creating user.", 500);
        return next(error);
    }

    res.status(200).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            "Loggin in failed, please try again later.",
            500
        );
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            "Invalid credentials, could not log you in.",
            401
        );
        return next(error);
    }

    res.json({
        message: "Logged in!",
        user: existingUser.toObject({ getters: true }),
    });
};

const getUserById = async (req, res, next) => {
    const id = req.params.uid;

    let foundedUser;
    try {
        foundedUser = await User.findById(id);
    } catch (err) {
        const error = new HttpError(
            "Fetching user failed, please try again later.",
            500
        );
        return next(error);
    }
    console.log(foundedUser);

    if (!foundedUser) {
        return next(
            new HttpError("Could not find user for the provided user id.", 404)
        );
    }

    res.json({ user: foundedUser });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signup = signup;
exports.login = login;
