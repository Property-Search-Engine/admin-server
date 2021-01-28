const passport = require("passport");

const db = require("../models");

const generateJWT = require("../utils/auth/generateJWT");
const getSanitizedUser = require("../utils/auth/getSanitizedUser");

async function signUp(req, res, next) {
  passport.authenticate("signup", async (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(400).send({
        data: null,
        error: "Already signed up",
      });
    }

    const { name, lastname, email, password } = req.body;

    if (!name || !lastname || !email || !password) {
      res.status(400).send({
        data: null,
        error: "Missing Fields",
      });
    }

    req.login(user, { session: false }, async (error) => {
      if (error) return next(error);

      const newUser = await db.User.create({
        name: name,
        lastname: lastname,
        email: user,
        password: password,
      }).catch((error) => {
        return next(error);
      });

      const token = generateJWT(newUser._id, next);

      newUser.token = token;

      await newUser.save().catch(next);

      const sanitizedUser = getSanitizedUser(newUser.toObject());

      res.status(201).send({
        data: {
          user: sanitizedUser,
          token: token,
        },
        error: null,
      });
    });
  })(req, res, next);
}

async function login(req, res, next) {
  passport.authenticate("login", async (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(400).send({
        data: null,
        error: "Unauthorized",
      });
    }

    req.login(user, { session: false }, async (error) => {
      if (error) return next(error);

      try {
        const token = generateJWT(user._id, next);

        await db.User.findByIdAndUpdate(user._id, { token: token }).catch(next);

        // Send back the token to the user
        return res.status(200).send({
          data: {
            user: user,
            token: token,
          },
          error: null,
        });
      } catch (error) {
        return next(error);
      }
    });
  })(req, res, next);
}

async function me(req, res) {
  if (req.user) {
    res.status(200).send({
      data: {
        user: req.user,
      },
      error: null,
    });
  } else {
    res.status(401).send({
      data: null,
      error: "Unauthorized",
    });
  }
}

async function logout(req, res, next) {
  if (req.user) {
    const user = req.user;

    const dbUser = await db.User.findOne({ email: user.email }).catch(next);
    dbUser.token = null;
    await dbUser.save().catch(next);

    req.logout();

    return res.status(200).send({
      data: "Ok",
      error: null,
    });
  } else {
    res.status(401).send({
      data: null,
      error: "Unauthorized",
    });
  }
}

module.exports = {
  signUp,
  login,
  logout,
  me,
};
