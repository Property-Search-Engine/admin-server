const testServer = require("../../utils/mock/db-test-server");
const { Employee, Home, Office } = require("../index");
const { getTestEmployee1, getTestEmployee2, getHome, getOffice } = require("../../utils/mock/seedTestDB");

beforeAll(async () => await testServer.initTestServer());
afterEach(async () => await testServer.clearCollection("employees"));
afterAll(async () => await testServer.stopTestServer());

describe("employee model", () => {

  it("can create a new employee model without properties defined", async () => {
    const testEmployee = getTestEmployee2();
    const employee = await Employee.create(testEmployee);

    expect(employee._id).toBeDefined();
    expect(employee.firstname).toBe(testEmployee.firstname);
    expect(employee.lastname).toBe(testEmployee.lastname);
    expect(employee.email).toBe(testEmployee.email);
    expect(employee.phone).toBe(testEmployee.phone);
  });

  it("can create a new employee model with a home and an office", async () => {

    const home = await Home.create(getHome());
    await Office.create(getOffice());
    
    const testEmployee = getTestEmployee1();
    const employee = await Employee.create(testEmployee);
    const result = await Employee.findById(employee._id).populate("properties").lean().exec();

    expect(result.properties[0].employee_id.toString()).toMatch(getHome().employee_id);
    expect(result.properties[1].employee_id.toString()).toMatch(getOffice().employee_id);
  });
});
