const logger = require("loglevel");

logger.enableAll();

const {
  NODE_ENV = "development",
  MONGO_DB_URL_PRODUCTION,
  MONGO_DB_URL_DEVELOPMENT,
  MONGO_DB_URL_TEST,
  PORT = 5000,
  JWT_SECRET,
  BCRYPT_SALT_ROUNDS,
  FB_CERT_TYPE,
  FB_CERT_PROJECT_ID,
  FB_CERT_PRIVATE_KEY_ID,
  FB_CERT_PRIVATE_KEY,
  FB_CERT_CLIENT_EMAIL,
  FB_CERT_CLIENT_ID,
  FB_CERT_AUTH_URI,
  FB_CERT_TOKEN_URI,
  FB_CERT_AUTH_PROVIDER_X_509_CERT_URL,
  FB_CERT_CLIENT_X_509_CERT_URL
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
  firebase: {
    certConfig: {
      type: FB_CERT_TYPE,
      project_id: FB_CERT_PROJECT_ID,
      private_key_id: FB_CERT_PRIVATE_KEY_ID,
      private_key: FB_CERT_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: FB_CERT_CLIENT_EMAIL,
      client_id: FB_CERT_CLIENT_ID,
      auth_uri: FB_CERT_AUTH_URI,
      token_uri: FB_CERT_TOKEN_URI,
      auth_provider_x509_cert_url: FB_CERT_AUTH_PROVIDER_X_509_CERT_URL,
      client_x509_cert_url: FB_CERT_CLIENT_X_509_CERT_URL,
    }
  }
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
