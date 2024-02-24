const HttpError = require("../../utils/http-error");

const validateLoginBody = (req, res, next) => {

    const { email, password} = req.body;
    const errors = [];

    if (!email || !email.trim()) {
        errors.push("Email is required");
    }
    if (!password || !password.trim()) {
        errors.push("Password is required");
    }

    if (errors.length > 0) {
        const error = new HttpError("Validation failed", 400, errors);
        return next(error);
    }

    next();
};

const validateSignUpBody = (req, res, next) => {

    const { email, password, name} = req.body;
    const errors = [];

    if (!email || !email.trim()) {
        errors.push("Email is required");
    }
    if (!password || !password.trim()) {
        errors.push("Password is required");
    }
    if (!name || !name.trim()) {
        errors.push("Name is required");
    }

    if (errors.length > 0) {
        const error = new HttpError("Validation failed", 400, errors);
        return next(error);
    }

    next();
};



module.exports = {
    validateLoginBody,
    validateSignUpBody
}