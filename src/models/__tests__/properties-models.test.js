const testServer = require("../../mock/db-test-server");
const { Home, Office } = require("../index");
const {
  getHome,
  getOffice,
} = require("../../mock/seedTestDB");

beforeAll(async () => await testServer.initTestServer());
afterEach(async () => {
  await testServer.clearCollection("employees")
  await testServer.clearCollection("properties")
});
afterAll(async () => await testServer.stopTestServer());

describe("properties models", () => {
  const testHome = getHome();
  const testOffice = getOffice();

  it("can create a new home model", async () => {
    const home = await Home.create(testHome);

    expect(home._id).toBeDefined();
    expect(home.kind).toEqual("Home");
    expect(home.homeType).toEqual(testHome.homeType);
    expect(home.sold).toBeFalsy();
    expect(home.bedRooms).toEqual(testHome.bedRooms);
    expect(home.bathRooms).toEqual(testHome.bathRooms);
    expect(home.description).toEqual(testHome.description);
    expect(home.price).toEqual(testHome.price);
    expect(home.condition).toEqual(testHome.condition);
    expect(home.surface).toEqual(testHome.surface);
    expect(home.equipment).toEqual(testHome.equipment);
    expect(home.images).toContainEqual(testHome.images[0]);
    expect(home.filters).toContainEqual(testHome.filters[0]);
    expect(home.contactInfo).toBeTruthy();
    expect(home.address).toBeTruthy();
  });

  it("can create a new office model", async () => {
    const office = await Office.create(testOffice);

    expect(office._id).toBeDefined();
    expect(office.kind).toEqual("Office");
    expect(office.sold).toBeFalsy();
    expect(office.description).toEqual(testOffice.description);
    expect(office.price).toEqual(testOffice.price);
    expect(office.surface).toEqual(testOffice.surface);
    expect(office.images).toContainEqual(testOffice.images[0]);
    expect(office.filters).toContainEqual(testOffice.filters[0]);
    expect(office.contactInfo).toBeTruthy();
    expect(office.address).toBeTruthy();
  });
});
