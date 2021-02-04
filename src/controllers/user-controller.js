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
    const employee = await db.Employee.findOneAndDelete({ email });

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

async function update(req, res, next) {
  const { uid, email } = req.employee
  const { firstname, lastname, phone } = req.body;

  try {
    const employee = await db.Employee.findOneAndUpdate({ _id: uid, email }, { firstname, lastname, phone }, { new: true });
    if (employee) {
      return res.status(201).send({ data: employee })
    }
    res.status(404).send({
      message: "User not found."
    });
  } catch (error) {
    next(error);
  }
}
async function stats(req, res, next) {
  const { uid, email } = req.employee

  try {
    const myProperties = await db.Property.aggregate([
      {
        "$match": {
          "employee_id": { "$eq": uid },
        }
      },
      {
        "$group": {
          "_id": "$employee_id",
          "revenue": { "$sum": "$price" },
          "sold": { "$sum": { $cond: ["$sold", 1, 0] } },
          "available": { "$sum": { $cond: ["$sold", 0, 1] } }
        }
      }
    ])
    if (myProperties[0]) {
      return res.status(201).send({ data: myProperties[0] })
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
  deleteUser,
  update,
  stats
};
