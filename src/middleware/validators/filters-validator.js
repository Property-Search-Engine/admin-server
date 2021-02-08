const Joi = require("joi");

const stringArrayEnum = (...elems) =>
    Joi.array()
        .items(Joi.string().valid(...elems))
        .default([]);

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
    filters: stringArrayEnum("petsAllowed",
        "lift",
        "garden",
        "airConditioning",
        "terrace",
        "swimming"),
    ...homeFilters,
    ...officeFilters,
});

async function validateSearchFilters(req, res, next) {
    try {
        req.query = await filtersSchema.validateAsync(req.query);
        next();
    } catch (err) {
        next({ statusCode: 400, message: err.details });
    }
}

module.exports = validateSearchFilters;
