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

module.exports = { generateJWT };
