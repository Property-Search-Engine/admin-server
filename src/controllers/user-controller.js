const db = require("../models");

async function register(req, res, next) {
  const { firstname, lastname, phone } = req.body;
  const { uid, email } = req.employee
  try {
    const employee = await db.Employee.findOne({ email });

    if (employee) {
      return res.status(200).send(employee)
    }
    const newEmployee = await db.Employee.create({
      _id: uid,
      email,
      firstname,
      lastname,
      phone
    });
    res.status(200).send({
      data: newEmployee
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { uid, email } = req.employee

  try {
    const employee = await db.Employee.findOne({ _id: uid });
    if (employee) {
      return res.status(200).send({ data: employee })
    }
    res.status(404).send({
      message: "User not found."
    });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  const { email } = req.employee

  try {
    const employee = await db.Employee.findOne({ email });

    if (employee) {
      return res.status(202).send({ message: "Employee deleted" })
    }
    res.status(404).send({
      message: "User not found."
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  deleteUser
};
