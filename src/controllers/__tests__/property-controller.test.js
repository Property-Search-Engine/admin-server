const supertest = require("supertest");

const testServer = require("../../utils/mock/db-test-server");
const app = require("../../server");
const db = require("../../models");
const { searchProperty } = require("../property-controller");
const { getTestEmployeeFP } = require("../../utils/mock/seedTestDB");

const request = supertest(app);

beforeAll(async () => {
    await testServer.initTestServer();
});

afterAll(async () => {
    await testServer.clearCollection("properties");
    await testServer.stopTestServer();
});

describe("Test properties aggregation", () => {

    // TODO: property tests
    it("can replace the root", async () => {
        // const employee = await db.Employee.create(getTestEmployeeFP());
        // const req = { user: { uid: employee._id }, query: { type: "Home" } };
        // const properties = await searchProperty(req);
        // expect(employee.properties[0]).toMatchObject(properties[0]);
        // expect(employee.properties[1]).toMatchObject(properties[1]);
        expect(true).toBeTruthy();
    })
})
