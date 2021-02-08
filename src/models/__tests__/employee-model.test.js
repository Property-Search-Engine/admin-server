const testServer = require("../../mock/db-test-server");
const { Employee } = require("../index");
const { getTestEmployee2 } = require("../../mock/seedTestDB");

beforeAll(async () => await testServer.initTestServer());
afterEach(async () => {
  await testServer.clearCollection("employees")
  await testServer.clearCollection("properties")
});
afterAll(async () => await testServer.stopTestServer());

describe("employee model", () => {

  it("can create a new employee", async () => {
    const testEmployee = getTestEmployee2();
    const employee = await Employee.create(testEmployee);

    expect(employee._id).toBeDefined();
    expect(employee.firstname).toBe(testEmployee.firstname);
    expect(employee.lastname).toBe(testEmployee.lastname);
    expect(employee.email).toBe(testEmployee.email);
    expect(employee.phone).toBe(testEmployee.phone);
  });
});
