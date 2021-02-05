const db = require("../models");
const { auth } = require("../firebase/firebase");
const { validateRegisterData } = require("../middleware/validators/employee-validator");

async function register(req, res, next) {
  const { firstname, lastname, phone, email, password } = req.body;
  try {
    //if registered Firebase -> checkif registered Mongo -> return Document
    auth.getUserByEmail(email).then(async function (existsUser) {
      const employee = await db.Employee.findOne({ email });
      if (employee) {
        return res.status(200).send({ data: employee })
      } else {
        const { error, value } = validateRegisterData({ firstname, lastname, phone, _id: existsUser.uid, email })
        if (error) {
          const { message } = error.details[0]
          return res.status(400).send({ message })
        }
        const newEmployee = await db.Employee.create({ ...value });
        return res.status(200).send({
          data: newEmployee
        });
      }
    }).catch(async function (FBerror) {
      switch (FBerror.code) {
        case 'auth/user-not-found':
          const newFBUser = await auth.createUser({
            email, password
          })
          const { error, value } = validateRegisterData({ firstname, lastname, phone, _id: newFBUser.uid, email })
          if (error) {
            const { message } = error.details[0]
            return res.status(400).send({ message })
          }
          try {
            const newEmployee = await db.Employee.create({ ...value });
            if (newEmployee) {
              return res.status(200).send({
                data: newEmployee
              });
            }
          } catch (error) {
            next(error)
          }
          break;
        case "auth/id-token-expired":
          return res.status(401).send({ message: "Firebase ID token has expired." })
        default:
          return res.status(400).send({
            message: FBerror.message
          })
      }
    })
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { uid } = req.employee

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
  const { email, uid } = req.employee

  try {
    const employee = await db.Employee.findOneAndDelete({ email });

    if (employee) {
      const Properties = await db.Property.remove({ employee_id: uid })
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
  const { error, value } = validateRegisterData({ firstname, lastname, phone, _id: uid, email })
  if (error) {
    const { message } = error.details[0]
    return res.status(400).send({ message })
  }
  console.log(value)
  try {
    const employee = await db.Employee.findOneAndUpdate({ _id: uid, email }, { firstname: value.firstname, lastname: value.lastname, phone: value.phone }, { new: true });
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
