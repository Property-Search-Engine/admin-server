const { Router } = require("express");
const { validateRegisterData, validateUpdateData } = require("../middleware/validators/employee-validator");

const userRouter = Router();

const {
    register,
    login,
    deleteUser,
    update,
    stats,
    myRefered,
    myBookings,
    deleteOtherUser
} = require("../controllers/user-controller");

userRouter.post("/register", validateRegisterData, register);
userRouter.post("/login", login);
userRouter.delete("/", deleteUser);
userRouter.delete("/:uid", deleteOtherUser);
userRouter.put("/profile", validateUpdateData, update);
userRouter.get("/statistics", stats);
userRouter.get("/employees", myRefered);
userRouter.get("/bookings", myBookings);

module.exports = userRouter;
