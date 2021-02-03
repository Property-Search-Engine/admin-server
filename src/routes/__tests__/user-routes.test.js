const supertest = require("supertest");

const testServer = require("../../utils/tests/db-test-server");
const { getTestEmployeeNP } = require("../../utils/tests/seedTestDB");

const app = require("../../server");
const Employee = require("../../models/employee-model");

const request = supertest(app);

beforeAll(async () => {
    await testServer.initTestServer();
});

afterEach(async () => await testServer.clearCollection("employees"));
afterAll(async () => await testServer.stopTestServer());

describe("user route", () => {
    const testUser = getTestEmployeeNP();

    it("can sign up a new user", async () => {
        console.log(testUser)
        const res = await request
            .post("/user/register").set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjljZTVlNmY1MzBiNDkwMTFiYjg0YzhmYWExZWM1NGM1MTc1N2I2NTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2FzYS1tZSIsImF1ZCI6ImNhc2EtbWUiLCJhdXRoX3RpbWUiOjE2MTIzNjc2MzQsInVzZXJfaWQiOiIxMG0wbkFLMWlwZUpIRG55QkROc0tQV2pCSlIyIiwic3ViIjoiMTBtMG5BSzFpcGVKSERueUJETnNLUFdqQkpSMiIsImlhdCI6MTYxMjM2NzYzNCwiZXhwIjoxNjEyMzcxMjM0LCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.jtqcovNaTSHVg9JZ-bgQuHBO4aVz5ChBkyj536mLvbmSSfd5C3Zwk3UGSRrfu2XT7HDIECUDvpN5gd-KAhi0NvjXU8DJTVuLIsplbN7qQchhEufNX6wz7HNoj8VcigMVANczVQw72u8VuEwzz88h-QNQmZIids6OMPMIiNUZNAJIO0ZeJ6vs99lAJ83nju_ftMm-Bm_dKnC5XywMu77wJ2-3akE6jKmZkThuF1btYWDppFo5UGHVC56qG-lsZ3HO1P0zh257UqRaMKx00fKD5-yDmK0Oy7zzXPf6lgHxEpjoL2OXw8dhxSmKNKaP6DFcMfFzR8YfZ8WBOfYyDNt6mw")
            .send(JSON.stringify(testUser));

        expect(res.status).toBe(201);
        expect(res.body.data.user._id).toBeDefined();
        expect(res.body.data.user.email).toBe(testUser.email);
        expect(res.body.data.user.password).not.toBeDefined();
        expect(res.body.error).toBeNull();
    });

    it("can login", async () => {
        const user = await Employee.create({
            ...testUser.user,
            password: testUser.unhashedPassword,
        });

        const loginRes = await request.post("/user/login").send({
            email: user.email,
            password: testUser.unhashedPassword,
        });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body.data.user.email).toBe(testUser.user.email);
        expect(loginRes.body.data.token).toEqual(expect.any(String));
        expect(loginRes.body.error).toBeNull();
    });
});