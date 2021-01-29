const testServer = require("../../utils/tests/db-test-server");
const { Property, Home, Office } = require("../properties-model.js");
const { getHome, getOffice, getTestProperties } = require("../../utils/tests/seedTestDB");

beforeAll(async () => await testServer.initTestServer());
afterEach(async () => await testServer.clearCollection("properties"));
afterAll(async () => await testServer.stopTestServer());

describe("properties models", () => {
  const testHome = getHome();
  const testOffice = getOffice();

  it("hola", async() => {
    expect(true).toBe(true);
  })

  it("can create a new home model", async() => {
    const home = await Home.create(testHome);

    expect(home._id).toBeDefined();
    expect(home.kind).toEqual("Home");
    expect(home.homeType).toEqual(testHome.homeType);
    expect(home.sold).toEqual(testHome.sold);
    expect(home.bedRooms).toEqual(testHome.bedRooms);
    expect(home.bathRooms).toEqual(testHome.bathRooms);
    expect(home.description).toEqual(testHome.description);
    expect(home.equipment).toEqual(testHome.equipment);
    expect(home.price).toEqual(testHome.price);
    expect(home.condition).toEqual(testHome.condition);
    expect(home.surface).toEqual(testHome.surface);
    expect(home.equipment).toEqual(testHome.equipment);
    expect(home.images).toContainEqual(testHome.images[0]);
    expect(home.filters).toContainEqual(testHome.filters[0]);
    expect(home.contactInfo).toBeTruthy();
    expect(home.address).toBeTruthy();
  });
});
