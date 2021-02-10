const express = require("express");
const morgan = require("morgan");
const { json } = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const auth = require("./middleware/auth-middleware")
const { validateJWT } = require("./utils/auth/JWTAuth")
require("dotenv").config();

const app = express();

const errorMiddleware = require("./middleware/error-middleware");
const userRouter = require("./routes/user-routes");
const propertyRouter = require("./routes/property-routes");
const adminRouter = require("./routes/admin-routes");

app.use(morgan("dev"));
app.use(helmet());
app.use(json());

app.use(cors());

app.get("/admin", validateJWT, (req, res, next) => res.status(200).send("Authorized"))

app.use(auth());
app.use("/admin", adminRouter)
app.use("/user", userRouter);
app.use("/properties", propertyRouter);
app.use(errorMiddleware);

module.exports = app;
