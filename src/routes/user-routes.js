const { Router } = require("express");
const { validateRegisterData, validateUpdateData } = require("../middleware/validators/employee-validator");

const userRouter = Router();

const userController = require("../controllers/user-controller");

userRouter.post("/register", validateRegisterData, userController.register);
userRouter.post("/login", userController.login);
userRouter.delete("/", userController.deleteUser);
userRouter.put("/profile", validateUpdateData, userController.update);
userRouter.get("/statistics", userController.stats);

module.exports = userRouter;
