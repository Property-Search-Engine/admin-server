const mongoose = require("mongoose");
require("dotenv").config();

const EmployeeSchema = require("./schemas/employee")

const Employee = mongoose.model("employee", EmployeeSchema);

module.exports = Employee;
