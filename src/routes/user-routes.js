const { Router } = require("express");
const passport = require("passport");

const userRouter = Router();

const userController = require("../controllers/user-controller");

userRouter.post("/user/sign-up", userController.signUp);
userRouter.post("/user/login", userController.login);

userRouter.post(
  "/user/logout",
  passport.authenticate("jwt", { session: false }),
  userController.logout,
);

userRouter.get(
  "/user/me",
  passport.authenticate("jwt", { session: false }),
  userController.me,
);

module.exports = userRouter;
