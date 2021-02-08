const db = require("../models");
const { getFbUserOrCreate } = require("../utils/auth/firebase");

async function register(req, res, next) {
  const { email, password } = req.body;
  //if registered Firebase -> checkif registered Mongo -> return Document
  const fbUser = await getFbUserOrCreate(email, password).catch(next);
  let employee = await db.Employee.findById(fbUser.uid)
    .lean()
    .exec()
    .catch(next);
  if (!employee) {
    employee = await db.Employee.create({ _id: fbUser.uid, ...req.body }).catch(next);
  }
  res.status(200).send({ data: employee })
}

async function login(req, res, next) {
  const { uid } = req.employee;
  const employee = await db.Employee.findById(uid)
    .lean()
    .exec()
    .catch(next);
  if (!employee) next({ statusCode: 404, message: "User not found." });
  else res.status(200).send({ data: employee });
}

async function deleteUser(req, res, next) {
  const { uid } = req.employee
  await db.Employee.findByIdAndDelete(uid).catch(next);
  await db.Property.deleteMany({ employee_id: uid }).catch(next);
  res.status(202).send({ message: "Employee deleted", error: null })
}

async function update(req, res, next) {
  const { uid } = req.employee;
  const { firstname, lastname, phone } = req.body;

  const employee = await db.Employee.findByIdAndUpdate(
    uid,
    { firstname, lastname, phone },
    { new: true }
  )
    .lean()
    .exec()
    .catch(next);

  if (!employee) next({ statusCode: 404, message: "User not found." });
  else res.status(200).send({ data: employee });
}

async function stats(req, res, next) {
  const { uid } = req.employee
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
  ]).catch(next);
  if (myProperties.length > 0) {
    res.status(201).send({ data: myProperties[0] })
  } else {
    next({ statusCode: 404, message: "User not found." })
  }
}

module.exports = {
  register,
  login,
  deleteUser,
  update,
  stats
};
