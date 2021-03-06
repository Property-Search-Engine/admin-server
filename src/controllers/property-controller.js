const db = require("../models");
const {
  buildPropertyBaseMatchingRules,
  buildHomeMatchingRules,
  buildOfficeMatchingRules
} = require("../utils/filters/index.js");
const config = require("../config")
const fetch = require("node-fetch");
const { searchFilteredProperties } = require("../utils/filters/index.js");
const { patchAddress } = require("../utils/bookings");

async function searchProperty(req, res, next) {
  const { uid } = req.employee || { uid: undefined };
  const filters = req.query;

  try {
    const properties = await searchFilteredProperties(filters, uid);
    res.status(200).send({
      data: properties,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

async function getPropertyById(req, res, next) {
  const { uid } = req.employee || { uid: undefined };
  const propertyID = req.params.propertyID;

  try {
    const property = await db.Property.findById(propertyID)
      .lean()
      .exec();

    if (!property) {
      return next({ statusCode: 404, message: "Property not found" });
    }
    if (uid && property.employee_id != uid) {
      return next({ statusCode: 403, message: "You cannot access this property" });
    }

    res.status(200).send({
      data: property,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteProperty(req, res, next) {
  const { uid } = req.employee;
  const propertyID = req.params.propertyID;

  try {
    const propertyFound = await db.Property.findById(propertyID)
      .lean()
      .exec();

    if (!propertyFound) return next({ statusCode: 404, message: "Property not found" });
    if (propertyFound.employee_id != uid) return next({ statusCode: 403, message: "You cannot access this property" });

    const property = await db.Property.findByIdAndDelete(propertyID)
      .lean()
      .exec();
    res.status(200).send({
      data: property,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

async function editProperty(req, res, next) {
  const { uid } = req.employee;
  const { kind } = req.body;
  const propertyID = req.params.propertyID;

  try {
    const propertyFound = await db.Property.findById(propertyID)
      .lean()
      .exec();

    if (!propertyFound) return next({ statusCode: 404, message: "Property not found" });
    if (propertyFound.employee_id != uid) return next({ statusCode: 403, message: "You cannot access this property" });

    const propertyData = { ...req.body };

    const property = await
      (kind === "Home" ? db.Home : db.Office)
        .findByIdAndUpdate(propertyID, propertyData, {
          new: true,
        })
        .lean()
        .exec();

    await patchAddress(property._id, property.address);

    res.status(200).send({
      data: property,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

async function createProperty(req, res, next) {
  const { kind } = req.body;
  const { uid, email } = req.employee;

  try {
    const employee = await db.Employee.findById(uid).lean().exec();

    const contactInfo = {
      phone: employee.phone,
      email: email,
    };
    const propertyData = { employee_id: employee._id, ...req.body, contactInfo };

    const property =
      kind === "Home"
        ? await db.Home.create(propertyData)
        : await db.Office.create(propertyData);

    res.status(201).send({
      data: property,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

async function setPropertyAsSold(req, res, next) {
  const { uid } = req.employee;
  const { propertyID } = req.params;

  try {
    const property = await db.Property.findById(propertyID).exec();

    if (!property) return next({ statusCode: 404, message: "Property not found" });
    if (property.employee_id != uid) return next({ statusCode: 403, message: "You cannot access this property" });

    property.sold = true;
    property.soldDate = Date.now();
    await property.save();

    res.status(200).send({
      data: property.toObject(),
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

async function setStatus(req, res, next) {
  const { propertyID, status } = req.params;
  try {
    const response = await fetch(`${config.client_server_url}/bookings/${propertyID}`, { method: "post", body: JSON.stringify({ status: status }), headers: { "auth": config.jwt.token, 'Content-Type': 'application/json' } })
      .then(response => response.json())
      .then(data => data);

    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  searchProperty,
  getPropertyById,
  editProperty,
  createProperty,
  deleteProperty,
  setPropertyAsSold,
  setStatus
};
