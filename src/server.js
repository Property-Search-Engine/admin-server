const express = require("express");
const morgan = require("morgan");
const { json } = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const authMiddleware = require("./middleware/auth-middleware")

require("dotenv").config();

const app = express();

const errorMiddleware = require("./middleware/error-middleware");
const userRouter = require("./routes/user-routes");
const propertyRouter = require("./routes/property-routes");

const auth = require("./utils/auth/passport");

app.use(morgan("dev"));
app.use(helmet());
app.use(json());

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use(auth.initialize);

//app.use(userRouter);
app.use("/properties", authMiddleware, propertyRouter);

app.use(errorMiddleware);

module.exports = app;
