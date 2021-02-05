const Joi = require("joi");
const extendedJoi = Joi.extend(require("joi-phone-number"));

const stringArrayEnum = (...elems) =>
  Joi.array()
    .items(Joi.string().valid(...elems))
    .default([]);

//todo: function
const whenKind = (kind, validation) =>
  validation.when("kind", { is: kind, then: Joi.required() });

const homeFilters = {
  homeType: stringArrayEnum("flatApartment", "house", "duplex", "penthouse"),
  equipment: stringArrayEnum("none", "partial", "full"),
  condition: stringArrayEnum("newHome", "goodCondition", "needsRenovation"),
  bedRooms: stringArrayEnum("1", "2", "3", "4+"),
  bathRooms: stringArrayEnum("1", "2", "3+"),
};

const officeFilters = {
  buildingUse: stringArrayEnum("private", "coWorking", "securitySystem"),
};

const filtersSchema = Joi.object({
  kind: Joi.string().valid("Home", "Office").required(),
  sold: Joi.boolean().default(false),
  surface: Joi.number().integer().min(0),
  minPrice: Joi.number().integer().min(0).default(0),
  maxPrice: Joi.number().integer().min(0).default(Infinity),
  publicationDate: Joi.date().max("now").timestamp("javascript"),
  filters: Joi.string().valid(
    "petsAllowed",
    "lift",
    "garden",
    "airConditioning",
    "terrace",
    "swimming",
  ),
  ...homeFilters,
  ...officeFilters,
});

// TODO:property schema, home schema, office schema
const homeSchema = {
  homeType: whenKind(
    "Home",
    Joi.string().valid("flatApartment", "house", "duplex", "penthouse"),
  ),
  bedRooms: whenKind("Home", Joi.number().integer().min(1)),
  bathRooms: whenKind("Home", Joi.number().integer().min(1)),
  equipment: whenKind("Home", Joi.string().valid("none", "partial", "full")),
  condition: whenKind(
    "Home",
    Joi.string().valid("newHome", "goodCondition", "needsRenovation"),
  ),
};

const officeSchema = {
  buildingUse: whenKind(
    "Office",
    Joi.string().valid("private", "coWorking", "securitySystem"),
  ),
};

const PropertySchema = Joi.object({
  kind: Joi.string().valid("Home", "Office").required(),
  price: Joi.number().integer().min(0).required(),
  description: Joi.string().trim().required(),
  filters: Joi.string().valid(
    "petsAllowed",
    "lift",
    "garden",
    "airConditioning",
    "terrace",
    "swimming",
  ),
  images: Joi.array().items(Joi.string().uri()).default([]),
  address: Joi.object({
    street: Joi.string().trim().required(),
    number: Joi.number().min(0).required(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
  }),
  //coordinates not required
  sold: Joi.boolean().default(false),
  surface: Joi.number().min(1).required(),
  sold_date: Joi.date(),
  ...officeSchema,
  ...homeSchema,
});

async function validateSearchFilters(req, res, next) {
  try {
    req.query = await filtersSchema.validateAsync(req.query);
    next();
  } catch (err) {
    res.status(400).send({
      data: null,
      errors: err.details,
    });
  }
}

async function validatePropertyInputs(req, res, next) {
  try {
    req.query = await PropertySchema.validateAsync(req.query);
    next();
  } catch (err) {
    res.status(400).send({
      data: null,
      errors: err.details,
    });
  }
}

module.exports = { validateSearchFilters, validatePropertyInputs };
