const mongoose = require("mongoose");
require("dotenv").config();

const EmployeeSchema = require("./schemas/employee")

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
