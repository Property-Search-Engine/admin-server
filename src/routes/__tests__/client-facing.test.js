const supertest = require("supertest");
const testServer = require("../../mock/db-test-server");
const app = require("../../server");
const setupTestDB = require("../../mock/seedTestDB");
const db = require("../../models");
const config = require("../../config");

const request = supertest(app);

let MOCK_PROPERTY = {};

beforeAll(async () => {
    await testServer.initTestServer();
    await setupTestDB.seedTestPropertiesDB();
    MOCK_PROPERTY = await setupTestDB.getIdenfitiedProperty();
});

afterAll(async () => {
    await testServer.clearCollections();
    await testServer.stopTestServer();
});

describe("Client facing routes", () => {
    it("can get property by Id", async () => {
        const res = await request.get(
            `/client/properties/${MOCK_PROPERTY._id}`,
        ).set({ 'auth': config.jwt.token, "Accept": 'application/json' });
        expect(res.status).toBe(200);
        expect(res.body.data).toMatchObject(MOCK_PROPERTY);
    });

    it("can search properties", async () => {
        const res = await request.get(
            `/client/properties?kind=Office`,
        ).set({ 'auth': config.jwt.token, "Accept": 'application/json' });
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(3);
        expect(MOCK_PROPERTY._id).toEqual(res.body.data[2]._id);
    });

    it("can search properties by city", async () => {
        const res = await request.get(
            `/client/properties?kind=Office&city=${MOCK_PROPERTY.address.city}`,
        ).set({ 'auth': config.jwt.token, "Accept": 'application/json' });
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0]._id).toEqual(MOCK_PROPERTY._id);
    });
});