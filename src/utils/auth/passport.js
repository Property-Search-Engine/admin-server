const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;

// Used to extract the JWT sent by the user
const ExtractJWT = require("passport-jwt").ExtractJwt;

const db = require("../../models");
const getSanitizedUser = require("./getSanitizedUser");
const config = require("../../config");

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async function signupStrategy(username, password, done) {
      /**
       * 1. If no user is found: return done(data, false);
       * 2. If the password is invalid: return done(data, false);
       * 3. For any other errors: return done(error);
       * 4. If the user is found: return done(null, user);
       *
       * The data and errors will be received by the `authenticate` method of passport.
       */
      try {
        const user = await db.User.findOne({
          email: username,
        })
          .exec()
          .catch((error) => {
            config.logger.error(error);
            return done(error);
          });

        if (user) {
          return done(null, false);
        } else {
          /**
           * Pass the username to the passport.authenticate middleware
           * to create the account there
           */
          return done(null, username);
        }
      } catch (error) {
        config.logger.error(error);
        return done(error);
      }
    },
  ),
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async function loginStrategy(username, password, done) {
      /**
       * 1. If no user is found: return done(data, false);
       * 2. If the password is invalid: return done(data, false);
       * 3. For any other errors: return done(error);
       * 4. If the user is found: return done(null, user);
       *
       * The data and errors will be received by the `authenticate` method of passport.
       */
      try {
        const user = await db.User.findOne({
          email: username,
        })
          .exec()
          .catch((error) => {
            config.logger.error(error);
            return done(error);
          });

        if (!user) {
          return done(null, false);
        }

        const passwordOK = await user.comparePassword(password);

        if (!passwordOK) {
          return done(null, false);
        }

        const sanitizedUser = getSanitizedUser(user.toObject());

        return done(null, sanitizedUser);
      } catch (error) {
        config.logger.error(error);
        return done(error);
      }
    },
  ),
);

passport.use(
  "jwt",
  new JWTstrategy(
    {
      // secret we used to sign the JWT
      secretOrKey: config.jwt.secret,

      // expect the user to send the token as a query parameter with the name 'secret_token'
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(config.jwt.secret),
    },
    async function jwtStrategyHandler(jwt_payload, done) {
      try {
        const user = await db.User.findById(jwt_payload.sub)
          .exec()
          .catch((error) => {
            config.logger.error(error);
            return done(error);
          });

        if (user && user.token) {
          const sanitizedUser = getSanitizedUser(user.toObject());

          // Pass the user details to the next middleware
          return done(null, sanitizedUser);
        } else {
          return done(null, false);
        }
      } catch (error) {
        done(error);
      }
    },
  ),
);

module.exports = {
  initialize: passport.initialize(),
};
