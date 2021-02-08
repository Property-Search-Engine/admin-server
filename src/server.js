const express = require("express");
const morgan = require("morgan");
const { json } = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const auth = require("./middleware/auth-middleware")

const app = express();

const errorMiddleware = require("./middleware/error-middleware");
const userRouter = require("./routes/user-routes");
const propertyRouter = require("./routes/property-routes");

app.use(morgan("dev"));
app.use(helmet());
app.use(json());
app.use(cors());

app.use(auth());
app.use("/user", userRouter);
app.use("/properties", propertyRouter);
app.use(errorMiddleware);

module.exports = app;
