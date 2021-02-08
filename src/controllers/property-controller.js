const db = require("../models");
const {
  buildPropertyBaseMatchingRules,
  buildHomeMatchingRules,
  buildOfficeMatchingRules
} = require("../utils/filters/index.js");

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
  const { uid } = req.employee;
  const propertyID = req.params.propertyID;

  const property = await db.Property.findById(propertyID)
    .lean()
    .exec()
    .catch(next);

  if (!property) {
    next({ statusCode: 404, message: "Property not found" })
    return;
  }
  if (property.employee_id != uid) {
    next({ statusCode: 403, message: "You cannot access this property" })
    return;
  }

  res.status(200).send({
    data: property,
    error: null,
  });
}

async function deleteProperty(req, res, next) {
  const { uid } = req.employee;
  const propertyID = req.params.propertyID;

  //get property by id
  const propertyFound = await db.Property.findById(propertyID)
    .lean()
    .exec()
    .catch(next);

  if (!propertyFound) {
    next({ statusCode: 404, message: "Property not found" })
    return;
  }
  if (propertyFound.employee_id != uid) {
    next({ statusCode: 403, message: "You cannot access this property" })
    return;
  }

  const property = await db.Property.findByIdAndDelete(propertyID)
    .lean()
    .exec()
    .catch(next);

  res.status(200).send({
    data: property,
    error: null,
  });
}

async function editProperty(req, res, next) {
  const { uid } = req.employee;
  const { kind } = req.body;
  const propertyID = req.params.propertyID;

  //get property by id
  const propertyFound = await db.Property.findById(propertyID)
    .lean()
    .exec()
    .catch(next);

  if (!propertyFound) {
    next({ statusCode: 404, message: "Property not found" })
    return;
  }
  if (propertyFound.employee_id != uid) {
    next({ statusCode: 403, message: "You cannot access this property" })
    return;
  }

  const propertyData = { ...req.body };

  const property = await
    (kind === "Home" ? db.Home : db.Office)
      .findByIdAndUpdate(propertyID, propertyData, {
        new: true,
      })
      .lean()
      .exec()
      .catch(next);

  res.status(200).send({
    data: property,
    error: null,
  });
}

async function createProperty(req, res, next) {
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

  const property = await (
    kind === "Home"
      ? db.Home.create(propertyData).catch(next)
      : db.Office.create(propertyData).catch(next)
  );

  res.status(201).send({
    data: property,
    error: null,
  });
}

async function setPropertyAsSold(req, res, next) {
  const { uid } = req.employee;
  const { propertyID } = req.params;

  //get property by id
  const property = await db.Property.findById(propertyID)
    .exec()
    .catch(next);

  if (!property) {
    next({ statusCode: 404, message: "Property not found" })
    return;
  }
  if (property.employee_id != uid) {
    next({ statusCode: 403, message: "You cannot access this property" })
    return;
  }

  property.sold = true;
  property.soldDate = Date.now();
  await property.save().catch(next);

  res.status(200).send({
    data: property.toObject(),
    error: null,
  });
}

module.exports = {
  searchProperty,
  getPropertyById,
  editProperty,
  createProperty,
  deleteProperty,
  setPropertyAsSold,
};
