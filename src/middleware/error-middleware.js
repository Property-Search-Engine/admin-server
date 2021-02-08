const config = require("../config");

module.exports = (err, req, res, next) => {
  if (req.headersSent) next(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).send({
    data: null,
    error: message,
  });
};
