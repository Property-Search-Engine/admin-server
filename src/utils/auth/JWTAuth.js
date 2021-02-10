const jwt = require("jsonwebtoken");

const config = require("../../config");

function generateJWT() {
  try {
    const payload = {
      sub: config.jwt.payload,
    };
    console.log(payload, config.jwt.sign)
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
    if (valid) next()
    else res.status(401).send({ message: "Not Authorized" })
  } catch (error) {
    next(error);
  }
}
module.exports = { generateJWT, validateJWT };