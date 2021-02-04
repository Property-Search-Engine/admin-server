const supertest = require("supertest");

const testServer = require("../../utils/mock/db-test-server");
const { getTestAuthEmployee, getHome, getMyHome, getMyOffice } = require("../../utils/mock/seedTestDB");

const app = require("../../server");
const Employee = require("../../models/employee-model");
const { Home, Office } = require("../../models/properties-model");

const request = supertest(app);

jest.mock('../../middleware/auth-middleware.js', () => {
    return jest.fn(() => (req, _, next) => {
        req.employee = {
            uid: "10m0nAK1ipeJHDnyBDNsKPWjBJR2",
            email: "test@test.com"
        }
        next();
    })
});

beforeAll(async () => {
    await testServer.initTestServer();
});

//afterEach(async () => await testServer.clearCollection("employees"));
afterAll(async () => {
    await testServer.clearCollection("properties");
    await testServer.clearCollection("employees");
    await testServer.stopTestServer();
});

describe("user route", () => {
    const testUser = getTestAuthEmployee();

    it("can sign up a new user", async () => {
        const res = await request
            .post("/user/register").set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjJjMmVkODQ5YThkZTI3ZTI0NjFlNGJjM2VmMDZhYzdhYjc4OGQyMmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2FzYS1tZSIsImF1ZCI6ImNhc2EtbWUiLCJhdXRoX3RpbWUiOjE2MTI0MzIyOTksInVzZXJfaWQiOiIxMG0wbkFLMWlwZUpIRG55QkROc0tQV2pCSlIyIiwic3ViIjoiMTBtMG5BSzFpcGVKSERueUJETnNLUFdqQkpSMiIsImlhdCI6MTYxMjQzMjI5OSwiZXhwIjoxNjEyNDM1ODk5LCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.aMuz00vRmKVTTCiES_VHHdUl7Z-HkUjEG5tr2YgL91-uVKyoGsdb4TYd4W3gPYtKKXMkIFtoxEZuQkBLA7ULZkVLwdWDd1w6kyc4WD1m5lCCG7fy5kxCtjfyYmHMGjH3EMm6AEvg_LwUOkjrU2v_mjJyLhvCv5yPOJaG8_32rtOLbxXo0CeNKnDq9ujo5atmaOcmvNfPUZQ6pnUMGdLj-zO6GnVOo5_9wYJyXfhCuHZfgeoGVREvjMRorRXzYelPgy7X-ctMlq5Mh_bgrzuvSVzIlywJeqNzsqvl14XYaDOkHwivN0HYU59CxtQZCTSR2YV06VTLyL2ciahEfMtpMA")
            .send(testUser);
        expect(res.status).toBe(200);
        expect(res.body.data._id).toBeDefined();
        expect(res.body.data.email).toBe(testUser.email);
        expect(res.body.error).toBeUndefined();
    });

    it("can login", async () => {
        const loginRes = await request.post("/user/login").set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjJjMmVkODQ5YThkZTI3ZTI0NjFlNGJjM2VmMDZhYzdhYjc4OGQyMmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2FzYS1tZSIsImF1ZCI6ImNhc2EtbWUiLCJhdXRoX3RpbWUiOjE2MTI0MzIyOTksInVzZXJfaWQiOiIxMG0wbkFLMWlwZUpIRG55QkROc0tQV2pCSlIyIiwic3ViIjoiMTBtMG5BSzFpcGVKSERueUJETnNLUFdqQkpSMiIsImlhdCI6MTYxMjQzMjI5OSwiZXhwIjoxNjEyNDM1ODk5LCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.aMuz00vRmKVTTCiES_VHHdUl7Z-HkUjEG5tr2YgL91-uVKyoGsdb4TYd4W3gPYtKKXMkIFtoxEZuQkBLA7ULZkVLwdWDd1w6kyc4WD1m5lCCG7fy5kxCtjfyYmHMGjH3EMm6AEvg_LwUOkjrU2v_mjJyLhvCv5yPOJaG8_32rtOLbxXo0CeNKnDq9ujo5atmaOcmvNfPUZQ6pnUMGdLj-zO6GnVOo5_9wYJyXfhCuHZfgeoGVREvjMRorRXzYelPgy7X-ctMlq5Mh_bgrzuvSVzIlywJeqNzsqvl14XYaDOkHwivN0HYU59CxtQZCTSR2YV06VTLyL2ciahEfMtpMA")
            .send({});
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
        const statsRes = await request.get("/user/statistics").set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjJjMmVkODQ5YThkZTI3ZTI0NjFlNGJjM2VmMDZhYzdhYjc4OGQyMmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2FzYS1tZSIsImF1ZCI6ImNhc2EtbWUiLCJhdXRoX3RpbWUiOjE2MTI0MzIyOTksInVzZXJfaWQiOiIxMG0wbkFLMWlwZUpIRG55QkROc0tQV2pCSlIyIiwic3ViIjoiMTBtMG5BSzFpcGVKSERueUJETnNLUFdqQkpSMiIsImlhdCI6MTYxMjQzMjI5OSwiZXhwIjoxNjEyNDM1ODk5LCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.aMuz00vRmKVTTCiES_VHHdUl7Z-HkUjEG5tr2YgL91-uVKyoGsdb4TYd4W3gPYtKKXMkIFtoxEZuQkBLA7ULZkVLwdWDd1w6kyc4WD1m5lCCG7fy5kxCtjfyYmHMGjH3EMm6AEvg_LwUOkjrU2v_mjJyLhvCv5yPOJaG8_32rtOLbxXo0CeNKnDq9ujo5atmaOcmvNfPUZQ6pnUMGdLj-zO6GnVOo5_9wYJyXfhCuHZfgeoGVREvjMRorRXzYelPgy7X-ctMlq5Mh_bgrzuvSVzIlywJeqNzsqvl14XYaDOkHwivN0HYU59CxtQZCTSR2YV06VTLyL2ciahEfMtpMA")
            .send();
        expect(statsRes.status).toBe(201);
        expect(statsRes.body.data._id).toBe(testUser._id);
        expect(statsRes.body.data.revenue).toBeDefined()
        expect(statsRes.body.data.sold).toBeDefined();
        expect(statsRes.body.data.available).toBeDefined()
        expect(statsRes.body.error).toBeUndefined();
    });
    it("can update", async () => {
        const loginRes = await request.put("/user/profile").set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjJjMmVkODQ5YThkZTI3ZTI0NjFlNGJjM2VmMDZhYzdhYjc4OGQyMmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2FzYS1tZSIsImF1ZCI6ImNhc2EtbWUiLCJhdXRoX3RpbWUiOjE2MTI0MzIyOTksInVzZXJfaWQiOiIxMG0wbkFLMWlwZUpIRG55QkROc0tQV2pCSlIyIiwic3ViIjoiMTBtMG5BSzFpcGVKSERueUJETnNLUFdqQkpSMiIsImlhdCI6MTYxMjQzMjI5OSwiZXhwIjoxNjEyNDM1ODk5LCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.aMuz00vRmKVTTCiES_VHHdUl7Z-HkUjEG5tr2YgL91-uVKyoGsdb4TYd4W3gPYtKKXMkIFtoxEZuQkBLA7ULZkVLwdWDd1w6kyc4WD1m5lCCG7fy5kxCtjfyYmHMGjH3EMm6AEvg_LwUOkjrU2v_mjJyLhvCv5yPOJaG8_32rtOLbxXo0CeNKnDq9ujo5atmaOcmvNfPUZQ6pnUMGdLj-zO6GnVOo5_9wYJyXfhCuHZfgeoGVREvjMRorRXzYelPgy7X-ctMlq5Mh_bgrzuvSVzIlywJeqNzsqvl14XYaDOkHwivN0HYU59CxtQZCTSR2YV06VTLyL2ciahEfMtpMA")
            .send({ firstname: "Changed", lastname: "Changed", phone: "123-123-123" });
        expect(loginRes.status).toBe(201);
        expect(loginRes.body.data.phone).toEqual("123-123-123");
        expect(loginRes.body.data.firstname).toEqual("Changed");
        expect(loginRes.body.data.lastname).toEqual("Changed");
        expect(loginRes.body.error).toBeUndefined();
    });
    it("can delete employee", async () => {
        const deletedRes = await request.delete("/user/").set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjJjMmVkODQ5YThkZTI3ZTI0NjFlNGJjM2VmMDZhYzdhYjc4OGQyMmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2FzYS1tZSIsImF1ZCI6ImNhc2EtbWUiLCJhdXRoX3RpbWUiOjE2MTI0MzIyOTksInVzZXJfaWQiOiIxMG0wbkFLMWlwZUpIRG55QkROc0tQV2pCSlIyIiwic3ViIjoiMTBtMG5BSzFpcGVKSERueUJETnNLUFdqQkpSMiIsImlhdCI6MTYxMjQzMjI5OSwiZXhwIjoxNjEyNDM1ODk5LCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.aMuz00vRmKVTTCiES_VHHdUl7Z-HkUjEG5tr2YgL91-uVKyoGsdb4TYd4W3gPYtKKXMkIFtoxEZuQkBLA7ULZkVLwdWDd1w6kyc4WD1m5lCCG7fy5kxCtjfyYmHMGjH3EMm6AEvg_LwUOkjrU2v_mjJyLhvCv5yPOJaG8_32rtOLbxXo0CeNKnDq9ujo5atmaOcmvNfPUZQ6pnUMGdLj-zO6GnVOo5_9wYJyXfhCuHZfgeoGVREvjMRorRXzYelPgy7X-ctMlq5Mh_bgrzuvSVzIlywJeqNzsqvl14XYaDOkHwivN0HYU59CxtQZCTSR2YV06VTLyL2ciahEfMtpMA")
            .send();
        expect(deletedRes.status).toBe(202);
        expect(deletedRes.body.message).toEqual("Employee deleted");
        expect(deletedRes.body.error).toBeUndefined();
    });
    it("can't login", async () => {
        const notloginRes = await request.post("/user/login").set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjJjMmVkODQ5YThkZTI3ZTI0NjFlNGJjM2VmMDZhYzdhYjc4OGQyMmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2FzYS1tZSIsImF1ZCI6ImNhc2EtbWUiLCJhdXRoX3RpbWUiOjE2MTI0MzIyOTksInVzZXJfaWQiOiIxMG0wbkFLMWlwZUpIRG55QkROc0tQV2pCSlIyIiwic3ViIjoiMTBtMG5BSzFpcGVKSERueUJETnNLUFdqQkpSMiIsImlhdCI6MTYxMjQzMjI5OSwiZXhwIjoxNjEyNDM1ODk5LCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.aMuz00vRmKVTTCiES_VHHdUl7Z-HkUjEG5tr2YgL91-uVKyoGsdb4TYd4W3gPYtKKXMkIFtoxEZuQkBLA7ULZkVLwdWDd1w6kyc4WD1m5lCCG7fy5kxCtjfyYmHMGjH3EMm6AEvg_LwUOkjrU2v_mjJyLhvCv5yPOJaG8_32rtOLbxXo0CeNKnDq9ujo5atmaOcmvNfPUZQ6pnUMGdLj-zO6GnVOo5_9wYJyXfhCuHZfgeoGVREvjMRorRXzYelPgy7X-ctMlq5Mh_bgrzuvSVzIlywJeqNzsqvl14XYaDOkHwivN0HYU59CxtQZCTSR2YV06VTLyL2ciahEfMtpMA")
            .send({});
        expect(notloginRes.status).toBe(404);
        expect(notloginRes.body.message).toEqual("User not found.");
        expect(notloginRes.body.error).toBeUndefined();
    });
});