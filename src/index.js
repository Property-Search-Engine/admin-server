const app = require("./server");
const config = require("./config");
const connect = require("./db/connect");

connect()
  .then(async () => {
    app.listen(config.port, () => {
      config.logger.debug(
        `Server listening on http://localhost:${config.port}`,
      );
    });
  })
  .catch((error) => {
    config.logger.error(error);
  });
