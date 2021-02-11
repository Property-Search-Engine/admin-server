const { Router } = require("express");
const { validateRegisterData, validateUpdateData } = require("../middleware/validators/employee-validator");

const userRouter = Router();

const {
    register,
    login,
    deleteUser,
    update,
    stats,
    myRefered
} = require("../controllers/user-controller");

userRouter.post("/register", validateRegisterData, register);
userRouter.post("/login", login);
userRouter.delete("/", deleteUser);
userRouter.put("/profile", validateUpdateData, update);
userRouter.get("/statistics", stats);
userRouter.get("/employees", myRefered);

module.exports = userRouter;
