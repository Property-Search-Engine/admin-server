const { Router } = require("express");
const { createJWT } = require("../controllers/admin-controller")
const adminRouter = Router();

adminRouter.get("/generate", createJWT);

module.exports = adminRouter;