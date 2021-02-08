const jwt = require("jsonwebtoken");
const config = require("../../config");

function generateJWT(userID, next) {
  if (!userID || typeof next !== "function") {
    throw new Error("Missing fields for JWT");
  }

  try {
    const payload = {
      sub: userID,
    };

    // Sign the JWT token and populate the payload
    // with the user email and id
    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: "2d",
    });

    return token;
  } catch (error) {
    return next(error);
  }
}

module.exports = generateJWT;
