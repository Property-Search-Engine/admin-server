const MOCK_EMPLOYEE_ID = "5d6ede6a0ba62570afcedd3a";
const mockAuth = require("../../mock/middleware/auth-middleware")(MOCK_EMPLOYEE_ID, "pepe@mail.com");
jest.mock('../../middleware/auth-middleware.js', () => mockAuth);

const supertest = require("supertest");
const testServer = require("../../mock/db-test-server");
const app = require("../../server");
const setupTestDB = require("../../mock/seedTestDB");
const db =  require("../../models");

const request = supertest(app);

beforeAll(async () => {
  await testServer.initTestServer();
  await setupTestDB.seedTestPropertiesDB();
});

afterAll(async () => {
  await testServer.clearCollections();
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
    expect(res.body.error[0].message).toBe('"kind" must be one of [Home, Office]');
  })

  it("can return empty array when no properties found", async () => {
    const res = await request.get("/properties?kind=Home&sold=true&minPrice=100000000")
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  })

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
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject(SAVED_PROPERTY.body.data);
  });

  it("cant delete not owned property", async () => {
    const TEST_PROPERTY = await setupTestDB.getHome();
    TEST_PROPERTY.employee_id = "dsfiojfgb";
    TEST_PROPERTY.address.city = "patata";
    const property = await db.Home.create(TEST_PROPERTY);

    const res = await request.del(
      `/properties/${property._id}`,
    );
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch("You cannot access this property");
  });

  it("can mark property as sold", async () => {
    const TEST_PROPERTY = await setupTestDB.getHome();
    TEST_PROPERTY.address.city = "Basilea";

    const SAVED_PROPERTY = await request
      .post("/properties")
      .send(TEST_PROPERTY);

    const res = await request
      .patch(`/properties/${SAVED_PROPERTY.body.data._id}/sold`);

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject(TEST_PROPERTY);
    expect(res.body.data.sold).toBe(true);
  });

  it("property not found gives proper error", async () => {
    const res = await request.get(`/properties/601d11bc54f8fc0013d16a01`);
    expect(res.status).toBe(404);
  });
});