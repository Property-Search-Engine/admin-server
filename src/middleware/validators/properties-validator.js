const Joi = require("joi");

const whenKind = (kind, validation) =>
  validation.when("kind", { is: kind, then: Joi.required() });

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
  filters: Joi.array.items(Joi.string().valid(
    "petsAllowed",
    "lift",
    "garden",
    "airConditioning",
    "terrace",
    "swimming",
  )),
  images: Joi.array().items(Joi.string().uri()).default([]),
  address: Joi.object({
    street: Joi.string().trim().required(),
    number: Joi.number().min(0).required(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    coordinates: Joi.object({
        lat: Joi.number().required(),
        long: Joi.number().required()
    })
  }),
  sold: Joi.boolean().default(false),
  surface: Joi.number().min(1).required(),
  soldDate: Joi.date(),
  ...officeSchema,
  ...homeSchema,
});


async function validatePropertyInputs(req, res, next) {
  try {
    req.body = await PropertySchema.validateAsync(req.body);
    next();
  } catch (err) {
     next({ statusCode: 400, message: err.details });
  }
}

module.exports = validatePropertyInputs;
