const db = require("../models");
const conf = require("../config")
const { generateJWT } = require("../middleware/stsauth-middleware")

async function createJWT(req, res, next) {
    const { payload, sign } = req.query
    if (payload === conf.jwt.payload && sign === conf.jwt.sign) {
        const token = generateJWT()
        return res.status(201).send({ token })
    }
    return next({ statusCode: 404, message: "Cannot GET" })
}
module.exports = {
    createJWT
};