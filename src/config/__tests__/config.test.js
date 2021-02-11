const config = require("../");

describe("App Config", () => {
  test("App config is set-up", () => {
    expect(config).toEqual({
      port: expect.any(String),
      jwt: {
        sign: expect.any(String),
        payload: expect.any(String)
      },
      bcryptSaltRounds: expect.any(Number),
      db: {
        url: expect.any(String),
      },
      logger: {
        warn: expect.any(Function),
        info: expect.any(Function),
        error: expect.any(Function),
        trace: expect.any(Function),
        debug: expect.any(Function),
      },
      firebase: {
        certConfig: {
          type: expect.any(String),
          project_id: expect.any(String),
          private_key_id: expect.any(String),
          private_key: expect.any(String),
          client_email: expect.any(String),
          client_id: expect.any(String),
          auth_uri: expect.any(String),
          token_uri: expect.any(String),
          auth_provider_x509_cert_url: expect.any(String),
          client_x509_cert_url: expect.any(String),
        }
      }
    });
  });
});
