const mongoose = require("mongoose");

const EmployeeSchema = require("./schemas/employee")

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
