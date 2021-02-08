const MOCK_EMPLOYEE_ID = "10m0nAK1ipeJHDnyBDNsKPWjBJR2";
const mockAuth = require("../../mock/middleware/auth-middleware")(MOCK_EMPLOYEE_ID, "test@test.com");
jest.mock('../../middleware/auth-middleware.js', () => mockAuth);

const supertest = require("supertest");
const testServer = require("../../mock/db-test-server");
const { getTestAuthEmployee, getHome, getMyHome, getMyOffice } = require("../../mock/seedTestDB");
const app = require("../../server");
const { Home, Office } = require("../../models/properties-model");

const request = supertest(app);

beforeAll(async () => {
    await testServer.initTestServer();
});

//afterEach(async () => await testServer.clearCollection("employees"));
afterAll(async () => {
    await testServer.clearCollections();
    await testServer.stopTestServer();
});

describe("user route", () => {
    const testUser = getTestAuthEmployee();

    it("can sign up a new user", async () => {
        let newUser = { password: "patata", ...testUser };
        const res = await request
            .post("/user/register")
            .send(newUser);

        expect(res.status).toBe(200);
        expect(res.body.data._id).toBeDefined();
        expect(res.body.data.email).toBe(testUser.email);
        expect(res.body.error).toBeUndefined();
    });

    it("can login", async () => {
        const loginRes = await request.post("/user/login");
        expect(loginRes.status).toBe(200);
        expect(loginRes.body.data.email).toBe(testUser.email);
        expect(loginRes.body.data.firstname).toEqual(testUser.firstname);
        expect(loginRes.body.data.lastname).toEqual(testUser.lastname);
        expect(loginRes.body.error).toBeUndefined();
    });

    it("can get stats", async () => {
        const MyHome = Home.create({ ...getMyHome(), sold: true })
        const NotMyHome = Home.create({ ...getHome(), sold: true })
        const MyOffice2 = Office.create({ ...getMyOffice(), sold: false })
        const statsRes = await request.get("/user/statistics");
        expect(statsRes.status).toBe(201);
        expect(statsRes.body.data._id).toBe(testUser._id);
        expect(statsRes.body.data.revenue).toBeDefined()
        expect(statsRes.body.data.sold).toBeDefined();
        expect(statsRes.body.data.available).toBeDefined()
        expect(statsRes.body.error).toBeUndefined();
    });

    it("can update", async () => {
        const loginRes = await request.put("/user/profile")
            .send({ firstname: "Changed", lastname: "Changed", phone: "123-123-123" });
        expect(loginRes.status).toBe(200);
        expect(loginRes.body.data.phone).toEqual("123-123-123");
        expect(loginRes.body.data.firstname).toEqual("Changed");
        expect(loginRes.body.data.lastname).toEqual("Changed");
        expect(loginRes.body.error).toBeUndefined();
    });

    it("can delete employee", async () => {
        const deletedRes = await request.delete("/user/");
        expect(deletedRes.status).toBe(202);
        expect(deletedRes.body.message).toEqual("Employee deleted");
        expect(deletedRes.body.error).toBeNull();
    });

    it("can't login", async () => {
        const notloginRes = await request.post("/user/login");
        expect(notloginRes.status).toBe(404);
        expect(notloginRes.body.error).toEqual("User not found.");
    });
});