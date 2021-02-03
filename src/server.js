const express = require("express");
const morgan = require("morgan");
const { json } = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const { authMiddleware } = require("./middleware/auth-middleware")
const { auth } = require("./firebase/firebase")
require("dotenv").config();

const app = express();

const errorMiddleware = require("./middleware/error-middleware");
const userRouter = require("./routes/user-routes");

app.use(morgan("dev"));
app.use(helmet());
app.use(json());
app.use(authMiddleware)
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.get("/", (req, res) => {
  res.status(200).send("hello-world")
})

app.use("/user", userRouter);

app.use(errorMiddleware);

module.exports = app;
