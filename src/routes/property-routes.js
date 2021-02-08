const { Router } = require("express");

const propertyRouter = Router();

const { getPropertyById,
    createProperty,
    searchProperty,
    editProperty,
    deleteProperty,
    setPropertyAsSold } = require("../controllers/property-controller");

const validateSearchFilters = require("../middleware/validators/filters-validator");
const validateCreateProperty = require("../middleware/validators/properties-validator");

propertyRouter.get("/", validateSearchFilters, searchProperty);
propertyRouter.get("/:propertyID", getPropertyById);
propertyRouter.post("/", validateCreateProperty, createProperty);
propertyRouter.put("/:propertyID", editProperty);
propertyRouter.delete("/:propertyID", deleteProperty);
propertyRouter.patch("/:propertyID/sold", setPropertyAsSold);

module.exports = propertyRouter;
