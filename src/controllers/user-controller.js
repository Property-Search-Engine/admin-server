const db = require("../models");
const { getFbUserOrCreate } = require("../utils/auth/firebase");

async function register(req, res, next) {
  const { email, password } = req.body;
  //if registered Firebase -> checkif registered Mongo -> return Document
  try {
    const fbUser = await getFbUserOrCreate(email, password);
    let employee = await db.Employee.findById(fbUser.uid)
      .lean()
      .exec();
    if (!employee) {
      employee = await db.Employee.create({ _id: fbUser.uid, ...req.body });
    }
    res.status(200).send({ data: employee })
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  const { uid } = req.employee;
  try {
    const employee = await db.Employee.findById(uid)
      .lean()
      .exec();
    if (!employee) next({ statusCode: 404, message: "User not found." });
    else res.status(200).send({ data: employee });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  const { uid } = req.employee
  try {
    await db.Employee.findByIdAndDelete(uid);
    await db.Property.deleteMany({ employee_id: uid });
    res.status(202).send({ message: "Employee deleted", error: null })
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  const { uid } = req.employee;
  const { firstname, lastname, phone } = req.body;

  try {
    const employee = await db.Employee.findByIdAndUpdate(
      uid,
      { firstname, lastname, phone },
      { new: true }
    )
      .lean()
      .exec();
    if (!employee) next({ statusCode: 404, message: "User not found." });
    else res.status(200).send({ data: employee });
  } catch (err) {
    next(err);
  }
}

async function stats(req, res, next) {
  const { uid } = req.employee
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
          "revenue": {
            "$sum": { $cond: ["$sold", "$price", 0] }
          },
          "sold": { "$sum": { $cond: ["$sold", 1, 0] } },
          "available": { "$sum": { $cond: ["$sold", 0, 1] } }
        }
      }
    ]);
    if (myProperties.length > 0) res.status(201).send({ data: myProperties[0] })
    else next({ statusCode: 404, message: "User not found." })
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  deleteUser,
  update,
  stats
};
