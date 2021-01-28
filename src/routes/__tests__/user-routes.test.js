const supertest = require("supertest");

const testServer = require("../../utils/tests/db-test-server");
const { getUsersRouteTestUser } = require("../../utils/tests/seedTestDB");

const app = require("../../server");
const User = require("../../models/user-model");

const request = supertest(app);

beforeAll(async () => {
  await testServer.initTestServer();
});

afterEach(async () => await testServer.clearCollection("users"));
afterAll(async () => await testServer.stopTestServer());

describe("user route", () => {
  const testUser = getUsersRouteTestUser();

  it("can sign up a new user", async () => {
    const res = await request
      .post("/user/sign-up")
      .send({ ...testUser.user, password: testUser.unhashedPassword });

    expect(res.status).toBe(201);
    expect(res.body.data.user._id).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.user.email);
    expect(res.body.data.user.password).not.toBeDefined();
    expect(res.body.error).toBeNull();
  });

  it("can login", async () => {
    const user = await User.create({
      ...testUser.user,
      password: testUser.unhashedPassword,
    });

    const loginRes = await request.post("/user/login").send({
      email: user.email,
      password: testUser.unhashedPassword,
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.user.email).toBe(testUser.user.email);
    expect(loginRes.body.data.token).toEqual(expect.any(String));
    expect(loginRes.body.error).toBeNull();
  });
});
