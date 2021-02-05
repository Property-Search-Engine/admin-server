const config = require("../config");

module.exports = (err, req, res, next) => {
  config.logger.debug("Error Handler Middleware: ");

  if (req.headersSent) {
    // When you add a custom error handler,
    // you must delegate to the default Express error handler,
    // when the headers have already been sent to the client:
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).send({
    data: null,
    error: message,
  });
};
