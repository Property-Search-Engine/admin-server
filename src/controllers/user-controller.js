const db = require("../models");
const { auth } = require("../firebase/firebase");

async function register(req, res, next) {
  const { email, password } = req.body;
  try {
    //if registered Firebase -> checkif registered Mongo -> return Document
    const fbUser = await auth.getUserByEmail(email);

    let employee = await db.Employee.findOne({ email })
      .lean()
      .exec()
      .catch(next);

    if (!employee) {
      employee = await db.Employee.create({ _id: fbUser.uid, ...req.body }).catch(next);
    }
    res.status(200).send({ data: employee })
  } catch (err) {
    switch (FBerror.code) {
      case 'auth/user-not-found':
        const newFBUser = await auth.createUser({ email, password })
        const newEmployee = await db.Employee.create({ _id: newFBUser.uid, ...req.body }).catch(next);
        res.status(200).send({ data: newEmployee });
        break;
      case "auth/id-token-expired":
        next({ statusCode: 401, message: "Firebase ID token has expired." })
      default:
        next({ statusCode: 400, message: FBerror.message })
    }
  }
}

async function login(req, res, next) {
  const { uid } = req.employee;

  const employee = await db.Employee.findById(uid)
    .lean()
    .exec()
    .catch(next);

  if(!employee) {
    return next({statusCode: 404, message: "User not found."});
  }

  res.status(200).send({ data: employee });
}

async function deleteUser(req, res, next) {
  const { uid } = req.employee

  await db.Employee.findByIdAndDelete(uid).catch(next);
  await db.Property.remove({ employee_id: uid }).catch(next);

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

  res.status(201).send({ data: employee })
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
        "revenue": { "$sum": "$price" },
        "sold": { "$sum": { $cond: ["$sold", 1, 0] } },
        "available": { "$sum": { $cond: ["$sold", 0, 1] } }
      }
    }
  ]).catch(next);

  if (myProperties[0]) {
    return res.status(201).send({ data: myProperties[0] })
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
