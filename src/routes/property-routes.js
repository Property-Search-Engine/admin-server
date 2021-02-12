const { Router } = require("express");

const propertyRouter = Router();

const {
  getPropertyById,
  createProperty,
  searchProperty,
  editProperty,
  deleteProperty,
  setPropertyAsSold,
  setStatus
} = require("../controllers/property-controller");

const validateSearchFilters = require("../middleware/validators/filters-validator");
const validateCreateProperty = require("../middleware/validators/properties-validator");
const validateEditProperty = require("../middleware/validators/edit-property-validator");

propertyRouter.get("/", validateSearchFilters, searchProperty);
propertyRouter.get("/:propertyID", getPropertyById);
propertyRouter.post("/", validateCreateProperty, createProperty);
propertyRouter.delete("/:propertyID", deleteProperty);
propertyRouter.patch("/:propertyID/sold", setPropertyAsSold);
propertyRouter.patch("/:propertyID", validateEditProperty, editProperty);
propertyRouter.post("/:propertyID/:status", setStatus);


module.exports = propertyRouter;
