const supertest = require("supertest");
const testServer = require("../../utils/mock/db-test-server");
const app = require("../../server");
const setupTestDB = require("../../utils/mock/seedTestDB");

const request = supertest(app);

const MOCK_EMPLOYEE_ID = "5d6ede6a0ba62570afcedd3a";

jest.mock('../../middleware/auth-middleware.js', () => {
  return jest.fn(() => (req, _, next) => {
    req.employee = {
      uid: MOCK_EMPLOYEE_ID,
      email: "pepe@mail.com"
    }
    next();
  })
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

  it("can add property to db", async () => {
    const TEST_PROPERTY = await setupTestDB.getHome();
    TEST_PROPERTY.address.city = "Tarragona";

    const res = await request.post("/properties").send(TEST_PROPERTY);
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject(TEST_PROPERTY);
  });

  it("can search a home successfully", async () => {
    const res = await request.get("/properties?kind=Home&homeType[]=house&sold=false&bedRooms[]=3&bathRooms[]=2&minPrice=100&maxPrice=300000&surface=100")
      .set('Accept', 'application/json');
    const data = res.body.data;

    expect(res.status).toBe(200);
    expect(data.length).toBeGreaterThanOrEqual(1);
    expect(data[0].employee_id).toBe(MOCK_EMPLOYEE_ID);
    expect(data[0].kind).toBe("Home");
    expect(data[0].bedRooms).toBe(3);
    expect(data[0].bathRooms).toBe(2);
    expect(data[0].surface).toBeGreaterThan(100);
    expect(data[0].price).toBeGreaterThanOrEqual(100);
    expect(data[0].price).toBeLessThanOrEqual(300000);
  })

  it("can search an office successfully", async () => {
    const res = await request.get("/properties?kind=Office&minPrice=100&maxPrice=300000&surface=100&buildingUse[]=coWorking&buildingUse[]=private")
      .set('Accept', 'application/json');
    const data = res.body.data;

    expect(res.status).toBe(200);
    expect(data.length).toBeGreaterThanOrEqual(1);
    expect(data[0].employee_id).toBe(MOCK_EMPLOYEE_ID);
    expect(data[0].kind).toBe("Office");
    expect(data[0].surface).toBeGreaterThan(100);
    expect(data[0].price).toBeGreaterThanOrEqual(100);
    expect(data[0].price).toBeLessThanOrEqual(300000);
    expect(data[0].buildingUse).toBe("coWorking");
  })

  it("can fail when wrong kind is provided", async () => {
    const res = await request.get("/properties?kind=patata")
      .set('Accept', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body.errors[0].message).toBe('"kind" must be one of [Home, Office]');
  })
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
