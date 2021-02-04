const supertest = require("supertest");
const testServer = require("../../utils/mock/db-test-server");
const app = require("../../server");
const setupTestDB = require("../../utils/mock/seedTestDB");
const { clearCollection } = require("../../utils/mock/db-test-server");

const request = supertest(app);

jest.mock("../../middleware/auth-middleware.js", () => {
  return jest.fn((req, res, next) => {
    req.employee = {
      uid: "5d6ede6a0ba62570afcedd3a",
      email: "pepe@mail.com",
    };
    next();
  });
});

beforeAll(async () => {
  await testServer.initTestServer();
  await setupTestDB.seedTestPropertiesDB();
});

afterAll(async () => {
  await testServer.clearCollection("properties");
  await testServer.clearCollection("employees");
  await testServer.stopTestServer();
});

describe("Private property routes", () => {
  it("can get property by Id", async () => {
    const TEST_PROPERTY = await setupTestDB.getHome();
    //insert into db test_property with create property
    TEST_PROPERTY.address.city = "Tarragona";
    const SAVED_PROPERTY = await request
      .post("/properties")
      .send(TEST_PROPERTY);

    const res = await request.get(
      `/properties/${SAVED_PROPERTY.body.data._id}`,
    );
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject(SAVED_PROPERTY.body.data);
  });

  it("can add property to db", async () => {
    const TEST_PROPERTY = await setupTestDB.getHome();
    TEST_PROPERTY.address.city = "Buenos Aires";

    const res = await request.post("/properties").send(TEST_PROPERTY);

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject(TEST_PROPERTY);
  });

  it("can edit property", async () => {
    const TEST_PROPERTY = await setupTestDB.getHome();
    TEST_PROPERTY.address.city = "Manila";

    const SAVED_PROPERTY = await request
      .post("/properties")
      .send(TEST_PROPERTY);

    const NEW_PROPERTY = await setupTestDB.getHome();
    NEW_PROPERTY.address.city = "Test City";
    NEW_PROPERTY.images = [
      "https://defendernetwork.com/wp-content/uploads/2018/11/snoopdogg_bibleoflove_publicityimage1.jpg",
    ];

    const res = await request
      .put(`/properties/${SAVED_PROPERTY.body.data._id}`)
      .send(NEW_PROPERTY);

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject(NEW_PROPERTY);
  });

  it("can delete property", async () => {
    const TEST_PROPERTY = await setupTestDB.getHome();
    TEST_PROPERTY.address.city = "Manila";

    const SAVED_PROPERTY = await request
      .post("/properties")
      .send(TEST_PROPERTY);

    const res = await request.del(
      `/properties/${SAVED_PROPERTY.body.data._id}`,
    );
    console.log(res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject(SAVED_PROPERTY.body.data);
  });

  it("can mark property as sold", async () => {
    const TEST_PROPERTY = await setupTestDB.getHome();
    TEST_PROPERTY.address.city = "Basilea";

    const SAVED_PROPERTY = await request
      .post("/properties")
      .send(TEST_PROPERTY);

    const NEW_PROPERTY = await setupTestDB.getHome();
    NEW_PROPERTY.sold = true;

    const res = await request
      .put(`/properties/${SAVED_PROPERTY.body.data._id}`)
      .send(NEW_PROPERTY);

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject(NEW_PROPERTY);
  });

  //TODO: try to get a property that doesn't exist
});

// describe("Public recipe routes", () => {

//   it("can fetch a single recipe", async () => {
//     const TEST_RECIPE = await setupTestDB.getRecipeWithComments();

//     const res = await request.get(`/recipes/${TEST_RECIPE._id}`);

//     expecconst TEST_PROPERTY = await setupTestDB.getHome();t(res.status).toBe(200);
//     expect(res.body.error).toBeNull();
//     expect(res.body.data._id).toEqual(expect.any(String));
//     expect(res.body.data.author._id).toEqual(expect.any(String));
//     expect(res.body.data.comments).toEqual(expect.any(Array));
//   });
// });

// describe("Authenticated recipe routes", () => {
//   let bearerToken = "";
//   let testRecipe;

//   beforeAll(async () => {
//     testRecipe = await setupTestDB.getRecipeWithComments();

//     const AUTHENTICATED_TEST_USER = setupTestDB.getAuthenticatedTestUser();

//     const user = {
//       email: AUTHENTICATED_TEST_USER.user.email,
//       password: AUTHENTICATED_TEST_USER.unhashedPassword,
//     };

//     const loginRes = await request.post("/user/login").send(user);

//     bearerToken = loginRes.body.data.token;
//   });

//   it("can add comments to a recipe", async () => {
//     const res = await request
//       .post(`/recipes/${testRecipe._id}/comment`)
//       .send({
//         commentBody: "Test comment body.",
//       })
//       .set("Authorization", `Bearer ${bearerToken}`);

//     expect(res.status).toBe(201);
//     expect(res.body.data._id).toEqual(expect.any(String));
//     expect(res.body.data.author._id).toEqual(expect.any(String));
//     expect(res.body.data.recipe).toEqual(expect.any(String));
//     expect(res.body.error).toBeNull();
//   });

//   it("can’t add comments to a recipe without a comment body", async () => {
//     const res = await request
//       .post(`/recipes/${testRecipe._id}/comment`)
//       .set("Authorization", `Bearer ${bearerToken}`);

//     expect(res.status).toBe(400);
//     expect(res.body.data).toBeNull();
//     expect(res.body.error).toMatch(/missing/i);
//   });

//   it("can’t add comments to a recipe without a token", async () => {
//     const res = await request.post(`/recipes/${testRecipe._id}/comment`);

//     expect(res.status).toBe(401);
//   });

//   it("can remove comments from a recipe", async () => {
//     const res = await request
//       .delete(`/recipes/${testRecipe._id}/${testRecipe.comments[0]}`)
//       .set("Authorization", `Bearer ${bearerToken}`);

//     expect(res.status).toBe(200);
//     expect(res.body.data).toBe("Ok");
//     expect(res.body.error).toBeNull();
//   });

//   it("can’t remove comments from a recipe without a token", async () => {
//     const res = await request.delete(
//       `/recipes/${testRecipe._id}/${testRecipe.comments[0]}`,
//     );

//     expect(res.status).toBe(401);
//   });
// });
