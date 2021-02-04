const db = require("../models");
const {
  buildPropertyBaseMatchingRules,
  buildHomeMatchingRules,
  buildOfficeMatchingRules,
} = require("../utils/properties/filters");

async function searchProperty(req, res, next) {
  const { uid } = req.employee;
  const filters = req.query;
  const properties = await (filters.kind == "Home"
    ? db.Home.find({
        employee_id: uid,
        ...buildPropertyBaseMatchingRules(filters),
        ...buildHomeMatchingRules(filters),
      })
    : db.Office.find({
        employee_id: uid,
        ...buildPropertyBaseMatchingRules(filters),
        ...buildOfficeMatchingRules(filters),
      })
  )
    .sort({ created_at: -1 })
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
    res.status(404).send({
      data: null,
      error: "Property not found",
    });
    return;
  }

  if (property.employee_id != uid) {
    res.status(403).send({
      data: null,
      error: "You cannot access this property",
    });
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
    res.status(404).send({
      data: null,
      error: "Property not found",
    });
    return;
  }

  if (propertyFound.employee_id != uid) {
    res.status(403).send({
      data: null,
      error: "You cannot access this property",
    });
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
    res.status(404).send({
      data: null,
      error: "Property not found",
    });
    return;
  }

  if (propertyFound.employee_id != uid) {
    res.status(403).send({
      data: null,
      error: "You cannot access this property",
    });
    return;
  }

  const propertyData = { ...req.body };

  const property = await (kind === "Home"
    ? db.Home.findByIdAndUpdate(propertyID, propertyData, {
        new: true,
      })
    : db.Home.findByIdAndUpdate(propertyID, propertyData, {
        new: true,
      })
  )
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

  const property =
    kind === "Home"
      ? await db.Home.create(propertyData).catch(next)
      : await db.Office.create(propertyData).catch(next);

  res.status(201).send({
    data: property,
    error: null,
  });
}

async function setPropertyAsSold(req, res, next) {
  //TODO: Patch property to be sold
  const { uid } = req.employee;
  const { kind } = req.body;
  const propertyID = req.params.propertyID;

  //get property by id
  const propertyFound = await db.Property.findById(propertyID)
    .lean()
    .exec()
    .catch(next);

  if (!propertyFound) {
    res.status(404).send({
      data: null,
      error: "Property not found",
    });
    return;
  }

  if (propertyFound.employee_id != uid) {
    res.status(403).send({
      data: null,
      error: "You cannot access this property",
    });
    return;
  }

  const propertyData = { ...req.body };

  const property = await (kind === "Home"
    ? db.Home.findByIdAndUpdate(propertyID, propertyData, {
        new: true,
      })
    : db.Home.findByIdAndUpdate(propertyID, propertyData, {
        new: true,
      })
  )
    .lean()
    .exec()
    .catch(next);

  res.status(200).send({
    data: property,
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
