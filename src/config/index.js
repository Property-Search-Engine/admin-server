require("dotenv").config();
const logger = require("loglevel");

logger.enableAll();

const {
  NODE_ENV = "development",
  MONGO_DB_URL_PRODUCTION,
  MONGO_DB_URL_DEVELOPMENT,
  MONGO_DB_URL_TEST,
  PORT = 4000,
  JWT_SECRET,
  BCRYPT_SALT_ROUNDS,
} = process.env;

const baseConfig = {
  port: PORT,
  jwt: {
    secret: JWT_SECRET,
  },
  bcryptSaltRounds: parseInt(BCRYPT_SALT_ROUNDS),
  logger: {
    warn: logger.warn,
    info: logger.info,
    error: logger.error,
    trace: logger.trace,
    debug: logger.debug,
  },
};

const config = {
  development: {
    ...baseConfig,
    db: {
      url: MONGO_DB_URL_DEVELOPMENT,
    },
  },
  test: {
    ...baseConfig,
    db: {
      url: MONGO_DB_URL_TEST,
    },
  },
  production: {
    ...baseConfig,
    db: {
      url: MONGO_DB_URL_PRODUCTION,
    },
  },
};

module.exports = config[NODE_ENV];
