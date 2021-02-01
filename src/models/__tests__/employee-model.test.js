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

  it("can create a new employee model without properties defined", async () => {

    const employee = await Employee.create(testEmployeeNP);

    expect(employee._id).toBeDefined();
    expect(employee.firstname).toBe(testEmployeeNP.firstname);
    expect(employee.lastname).toBe(testEmployeeNP.lastname);
    expect(employee.email).toBe(testEmployeeNP.email);
    expect(employee.phone).toBe(testEmployeeNP.phone);
    expect(employee.properties).toBeDefined()
  });

  it("can create a new employee model with empty properties", async () => {
    const employee = await Employee.create(testEmployeeDP);

    expect(employee._id).toBeDefined();
    expect(employee.firstname).toBe(testEmployeeNP.firstname);
    expect(employee.lastname).toBe(testEmployeeNP.lastname);
    expect(employee.email).toBe(testEmployeeNP.email);
    expect(employee.phone).toBe(testEmployeeNP.phone);
    expect(employee.properties).toBeDefined();
  });

  it("can create a new employee model with a home and an office", async () => {
    const employee = await Employee.create(testEmployeeFP);

    expect(employee._id).toBeDefined();
    expect(employee.firstname).toBe(testEmployeeNP.firstname);
    expect(employee.lastname).toBe(testEmployeeNP.lastname);
    expect(employee.email).toBe(testEmployeeNP.email);
    expect(employee.phone).toBe(testEmployeeNP.phone);
    expect(employee.properties).toHaveLength(2);
    expect(employee.properties[0]).toMatchObject(testEmployeeFP.properties[0]);
    expect(employee.properties[1]).toMatchObject(testEmployeeFP.properties[1]);
  });
});
