const db = require("../models");
const {
  buildPropertyBaseMatchingRules,
  buildHomeMatchingRules,
  buildOfficeMatchingRules
} = require("../utils/properties/filters");

async function searchProperty(req, res, next) {
  const { uid } = req.employee;
  const filters = req.query;
  const properties = await
    (filters.kind == "Home" ?
      db.Home.find({
        employee_id: uid,
        ...buildPropertyBaseMatchingRules(filters),
        ...buildHomeMatchingRules(filters)
      })
      : db.Office.find({
        employee_id: uid,
        ...buildPropertyBaseMatchingRules(filters),
        ...buildOfficeMatchingRules(filters)
      })
    )
      .sort({ created_at: -1 })
      .select("_id employee_id sold kind bedRooms bathRooms address price surface buildingUse images")
      .lean()
      .exec()
      .catch(next);

  res.status(200).send({
    data: properties,
    error: null,
  });
}

async function getPropertyById(req, res, next) {
  //TODO: Get property by id
  const propertyID = req.params.propertyID;

  const property = await db.Property.findById(propertyID)
    .select("-__v")
    .lean()
    .exec()
    .catch(next);

  if (property) {
    res.status(200).send({
      data: property,
      error: null,
    });
  } else {
    res.status(404).send({
      data: null,
      error: "Property not found",
    });
  }
}

function deleteProperty(req, res, next) {
  //TODO: Delete property by id
}

function editProperty(req, res, next) {
  //TODO: Edit property by id
}

async function createProperty(req, res, next) {
  //TODO: Create property

  const { kind } = req.body;
  const { uid, email } = req.employee;

  //get employee with db.Employee.findbyId ( uid)
  const employee = await db.Employee.findById(uid).lean().exec().catch(next);
  //grab email, id, phone
  //const contactinfo with those params
  const contactInfo = {
    phone: employee.phone,
    email: email,
  };

  const propertyData = { employee_id: employee._id, ...req.body, contactInfo };

  const property =
    kind === "Home"
      ? await db.Home.create(propertyData).catch(next)
      : await db.Office.create(propertyData).catch(next);

  res.status(201).send({
    data: property,
    error: null,
  });
}

function setPropertyAsSold(req, res, next) {
  //TODO: Patch property to be sold
}

module.exports = {
  searchProperty,
  getPropertyById,
  editProperty,
  createProperty,
  deleteProperty,
  setPropertyAsSold,
};
