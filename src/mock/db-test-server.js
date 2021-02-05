const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const { logger } = require("../config");

function setupTestServer() {
  let SERVER = null;
  let MONGO_URI = null;

  const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };

  async function startTestServer() {
    SERVER = new MongoMemoryServer();
    MONGO_URI = await SERVER.getUri();
  }

  function debugTestServer() {
    if (MONGO_URI) {
      logger.debug(`MongoDB connected to ${MONGO_URI}`);
    } else {
      logger.debug(`MongoDB not connected yet`);
    }
  }

  async function connectTestServer() {
    try {
      await mongoose.connect(MONGO_URI, MONGO_OPTIONS);

      mongoose.connection.on("error", (error) => {
        if (e.message.code === "ETIMEDOUT") {
          logger.debug(error);
          mongoose.connect(mongoUri, mongooseOpts);
        }

        logger.debug(error);
      });
    } catch (error) {
      logger.error(error);
    }
  }

  async function initTestServer() {
    await startTestServer();
    await connectTestServer();
  }

  async function clearCollection(collectionName) {
    return mongoose.connection.db.collection(collectionName).deleteMany({});
  }

  /**
   * Loops through all the collections in the mongoose connection and clears them
   */
  async function clearCollections() {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany();
    }
  }

  async function stopTestServer() {
    await mongoose.disconnect();
    await SERVER.stop();
  }

  return {
    initTestServer: initTestServer,
    debugTestServer: debugTestServer,
    clearCollection: clearCollection,
    clearCollections: clearCollections,
    stopTestServer: stopTestServer,
  };
}

module.exports = setupTestServer();
