const testServer = require("../../utils/tests/db-test-server");
const Employee = require("../employee-model");
const { getEmployeeModelTestEmployee } = require("../../utils/tests/seedTestDB");

beforeAll(async () => await testServer.initTestServer());
afterEach(async () => await testServer.clearCollection("employees"));
afterAll(async () => await testServer.stopTestServer());

describe("employee model", () => {
  const testEmployee = getEmployeeModelTestEmployee();

  it("can create a new employee model", async () => {
    const employee = await Employee.create(testEmployee.employee);

    expect(employee._id).toBeDefined();
    expect(employee.firstname).toBe(testEmployee.employee.firstname);
    expect(employee.lastname).toBe(testEmployee.employee.lastname);
    expect(employee.email).toBe(testEmployee.employee.email);
    expect(employee.phone).toBe(testEmployee.employee.phone);
  });
  it("can create a new employee property", async () => {
    const employee = await Employee.create(testEmployee.employee);

    expect(employee._id).toBeDefined();
    expect(employee.firstname).toBe(testEmployee.employee.firstname);
    expect(employee.lastname).toBe(testEmployee.employee.lastname);
    expect(employee.email).toBe(testEmployee.employee.email);
    expect(employee.phone).toBe(testEmployee.employee.phone);
  });
});
