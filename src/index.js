require("dotenv").config();

const app = require("./server");
const config = require("./config");
const connect = require("./db/connect");
// const { clearCollections } = require("./utils/mock/db-test-server");

connect()
  .then(async () => {
    // await clearCollections();

    app.listen(config.port, () => {
      config.logger.debug(
        `Server listening on http://localhost:${config.port}`,
      );
    });
  })
  .catch((error) => {
    config.logger.error(error);
  });
