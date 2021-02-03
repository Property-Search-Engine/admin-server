const { Router } = require("express");

const userRouter = Router();

const userController = require("../controllers/user-controller");

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.delete("/delete", userController.deleteUser);

module.exports = userRouter;
