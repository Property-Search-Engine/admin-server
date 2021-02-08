const Joi = require("joi");

const homeSchema = {
  homeType: Joi.string().valid("flatApartment", "house", "duplex", "penthouse"),
  bedRooms: Joi.number().integer().min(1),
  bathRooms: Joi.number().integer().min(1),
  equipment: Joi.string().valid("none", "partial", "full"),
  condition: Joi.string().valid("newHome", "goodCondition", "needsRenovation"),
};

const officeSchema = {
  buildingUse: Joi.string().valid("private", "coWorking", "securitySystem"),
};

const PropertySchema = Joi.object({
  kind: Joi.string().valid("Home", "Office").required(),
  price: Joi.number().integer().min(0),
  description: Joi.string().trim(),
  filters: Joi.array().items(
    Joi.string().valid(
      "petsAllowed",
      "lift",
      "garden",
      "airConditioning",
      "terrace",
      "swimming",
    ),
  ),
  images: Joi.array().items(Joi.string().uri()),
  address: Joi.object({
    street: Joi.string().trim(),
    number: Joi.number().min(0),
    city: Joi.string().trim(),
    state: Joi.string().trim(),
    country: Joi.string().trim(),
    coordinates: Joi.object({
      lat: Joi.number().required(),
      long: Joi.number().required(),
    }),
  }),
  surface: Joi.number().min(1),
  ...officeSchema,
  ...homeSchema,
});

async function validateEditProperty(req, res, next) {
  try {
    req.body = await PropertySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next({ statusCode: 400, message: err.details });
  }
}

module.exports = validateEditProperty;
