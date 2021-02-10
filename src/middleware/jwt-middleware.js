const config = require("../config");
const jwt = require("jsonwebtoken");

function validateJWT(req, res, next) {
    const authJWT = req.headers["auth"]
    try {
        const valid = jwt.verify(authJWT, config.jwt.sign);
        if (!valid) return next({ statusCode: 401, message: "Not Authorized" });
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = validateJWT;