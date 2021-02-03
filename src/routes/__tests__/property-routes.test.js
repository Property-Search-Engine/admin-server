const supertest = require("supertest");

const testServer = require("../../utils/mock/db-test-server");
const app = require("../../server");
const setupTestDB = require("../../utils/mock/seedTestDB");

const request = supertest(app);

beforeAll(async () => {
  await testServer.initTestServer();
});

afterAll(async () => {
  await testServer.clearCollection("properties");
  await testServer.stopTestServer();
});

describe("Private property routes", () => {
  // TODO: property tests Dani
  // it("can get property by Id", async () => {
  //   const TEST_PROPERTY = await setupTestDB.getHome();
  //   //insert into db test_property with create property
  //   const res = await request.get(`/properties/${TEST_PROPERTY._id}`);
  //   // const res = await request.get(`/properties/1`);
  //   console.log(TEST_PROPERTY);
  //   // console.log(TEST_PROPERTY._id);
  //   console.log(res);
  //   expect(res.status).toBe(200);
  //   expect(res.body.data._id).toEqual(expect.TEST_PROPERTY._id);
  //   // expect(res.body.data.author._id).toEqual(expect.any(String));
  //   // expect(res.body.data.comments).toEqual(expect.any(Array));
  // });

  it("can add property to db", async () => {
    // const TEST_PROPERTY = await setupTestDB.getHome();

    // const res = await request.post(`/properties/${testRecipe._id}/comment`);
    // expect(res.status).toBe(201);
    // expect(res.body.data._id).toEqual(expect.any(String));
    // expect(res.body.data.author._id).toEqual(expect.any(String));
    // expect(res.body.data.recipe).toEqual(expect.any(String));
    // expect(res.body.error).toBeNull();
    expect(true).toBe(true);
  });
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
