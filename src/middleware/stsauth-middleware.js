const jwt = require("jsonwebtoken");

const config = require("../config");

function generateJWT() {
    try {
        const payload = {
            sub: config.jwt.payload,
        };
        const token = jwt.sign(payload, config.jwt.sign);
        return token;
    } catch (error) {
        next(error);
    }
}

function validateJWT(req, res, next) {
    const authJWT = req.headers["auth"]
    try {
        const valid = jwt.verify(authJWT, config.jwt.sign);
        if (valid.sub == config.jwt.payload) return next()
        return next({ statusCode: 401, message: "Not Authorized" })
    } catch (error) {
        next(error);
    }
}

module.exports = { generateJWT, validateJWT };