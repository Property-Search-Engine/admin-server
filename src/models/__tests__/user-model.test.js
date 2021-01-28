const testServer = require("../../utils/tests/db-test-server");
const User = require("../user-model");
const { getUserModelTestUser } = require("../../utils/tests/seedTestDB");

beforeAll(async () => await testServer.initTestServer());
afterEach(async () => await testServer.clearCollection("users"));
afterAll(async () => await testServer.stopTestServer());

describe("user model", () => {
  const testUser = getUserModelTestUser();

  it("can create a new user model", async () => {
    const user = await User.create({
      ...testUser.user,
      password: testUser.unhashedPassword,
    });

    expect(user._id).toBeDefined();
    expect(user.password).not.toBe(testUser.unhashedPassword);
    expect(user.name).toBe(testUser.user.name);
    expect(user.lastname).toBe(testUser.user.lastname);
    expect(user.email).toBe(testUser.user.email);
  });
});
