const express = require("express");
const morgan = require("morgan");
const { json } = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

require("dotenv").config();

const app = express();

const errorMiddleware = require("./middleware/error-middleware");
const userRouter = require("./routes/user-routes");
const recipesRouter = require("./routes/recipes-routes");

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

app.use(userRouter);
app.use(recipesRouter);

app.use(errorMiddleware);

module.exports = app;
