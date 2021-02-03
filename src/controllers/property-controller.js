const db = require("../models");
const { buildFiltersFromQuery, matchProperties } = require("../utils/properties/filters");

async function searchProperty(req, res, next) {
    const { uid } = req.user;
    const filters = buildFiltersFromQuery(req);
    // const properties = await db.Employee.aggregate()
    //     .exec()
    //     .catch(next);

    // return properties;

    // res.status(200).send({
    //     data: properties,
    //     error: null,
    // });
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
