const config = require("../");

describe("App Config", () => {
  test("App config is set-up", () => {
    expect(config).toEqual({
      port: expect.any(Number),
      jwt: {
        secret: expect.any(String),
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
    });
  });
});
