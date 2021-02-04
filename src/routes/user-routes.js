const { Router } = require("express");

const userRouter = Router();

const userController = require("../controllers/user-controller");

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.delete("/", userController.deleteUser);
userRouter.put("/profile", userController.update);
userRouter.get("/statistics", userController.stats);

module.exports = userRouter;
