const supertest = require("supertest");

const testServer = require("../../utils/mock/db-test-server");
const { getTestEmployee1, getTestEmployee2 } = require("../../utils/mock/seedTestDB");

const app = require("../../server");
const Employee = require("../../models/employee-model");

const request = supertest(app);

beforeAll(async () => {
    await testServer.initTestServer();
});

//afterEach(async () => await testServer.clearCollection("employees"));
afterAll(async () => await testServer.stopTestServer());

describe("user route", () => {
    const testUser = getTestEmployee1();

    it("can sign up a new user", async () => {
        const res = await request
            .post("/user/register").set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjljZTVlNmY1MzBiNDkwMTFiYjg0YzhmYWExZWM1NGM1MTc1N2I2NTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2FzYS1tZSIsImF1ZCI6ImNhc2EtbWUiLCJhdXRoX3RpbWUiOjE2MTIzODMwNDgsInVzZXJfaWQiOiIxMG0wbkFLMWlwZUpIRG55QkROc0tQV2pCSlIyIiwic3ViIjoiMTBtMG5BSzFpcGVKSERueUJETnNLUFdqQkpSMiIsImlhdCI6MTYxMjM4MzA0OCwiZXhwIjoxNjEyMzg2NjQ4LCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.HBllFXV5w8l-tF-nBl0svF8gHx4Z8-MUsdOcGQP24fy3HrnCmOfDeJkSNNhYUoVTcRie2ocA0Q8dwz8YNftGKDeIp2UawNiDqmnkzfAEHjeL1H6ZCUW1mB1hPplDMs529HBlcVlwQMxMd-lkOSpB6G8s7BvKi0XK6xhZa4nAik4-HmjN6i9EmXAZmwnc1U2lvDZWBEbNgIshyGzWE_SuRtn1asSsmDOaveijBXMT4R9tuDcNeP17N2lFhILiSTl4t184AARepUjcNEqPvXNLlQXS-gtcjM_uF1VKdL3aOnh1Vj7mIqMEEcF86dzQDW8TMttdqSDgQuLCgJzt5f2CHQ")
            .send(testUser);
        expect(res.status).toBe(200);
        expect(res.body.data._id).toBeDefined();
        expect(res.body.data.email).toBe(testUser.email);
        expect(res.body.error).toBeUndefined();
    });

    it("can login", async () => {
        const loginRes = await request.post("/user/login").set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjljZTVlNmY1MzBiNDkwMTFiYjg0YzhmYWExZWM1NGM1MTc1N2I2NTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2FzYS1tZSIsImF1ZCI6ImNhc2EtbWUiLCJhdXRoX3RpbWUiOjE2MTIzODMwNDgsInVzZXJfaWQiOiIxMG0wbkFLMWlwZUpIRG55QkROc0tQV2pCSlIyIiwic3ViIjoiMTBtMG5BSzFpcGVKSERueUJETnNLUFdqQkpSMiIsImlhdCI6MTYxMjM4MzA0OCwiZXhwIjoxNjEyMzg2NjQ4LCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.HBllFXV5w8l-tF-nBl0svF8gHx4Z8-MUsdOcGQP24fy3HrnCmOfDeJkSNNhYUoVTcRie2ocA0Q8dwz8YNftGKDeIp2UawNiDqmnkzfAEHjeL1H6ZCUW1mB1hPplDMs529HBlcVlwQMxMd-lkOSpB6G8s7BvKi0XK6xhZa4nAik4-HmjN6i9EmXAZmwnc1U2lvDZWBEbNgIshyGzWE_SuRtn1asSsmDOaveijBXMT4R9tuDcNeP17N2lFhILiSTl4t184AARepUjcNEqPvXNLlQXS-gtcjM_uF1VKdL3aOnh1Vj7mIqMEEcF86dzQDW8TMttdqSDgQuLCgJzt5f2CHQ")
            .send({});
        expect(loginRes.status).toBe(200);
        expect(loginRes.body.data.email).toBe(testUser.email);
        expect(loginRes.body.data.firstname).toEqual(testUser.firstname);
        expect(loginRes.body.data.lastname).toEqual(testUser.lastname);
        expect(loginRes.body.error).toBeUndefined();
    });
});