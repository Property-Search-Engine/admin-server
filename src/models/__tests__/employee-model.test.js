const testServer = require("../../utils/tests/db-test-server");
const { Employee } = require("../index");
const { getTestEmployeeDP, getTestEmployeeNP, getTestEmployeeFP } = require("../../utils/tests/seedTestDB");

beforeAll(async () => await testServer.initTestServer());
afterEach(async () => await testServer.clearCollection("employees"));
afterAll(async () => await testServer.stopTestServer());

describe("employee model", () => {
  const testEmployeeNP = getTestEmployeeNP();
  const testEmployeeDP = getTestEmployeeDP();
  const testEmployeeFP = getTestEmployeeFP();

  it("can create a new employee model", async () => {

    const employee = await Employee.create(testEmployeeNP);

    expect(employee._id).toBeDefined();
    expect(employee.firstname).toBe(testEmployeeNP.firstname);
    expect(employee.lastname).toBe(testEmployeeNP.lastname);
    expect(employee.email).toBe(testEmployeeNP.email);
    expect(employee.phone).toBe(testEmployeeNP.phone);
    expect(employee.properties).toBeDefined()
  });
});
