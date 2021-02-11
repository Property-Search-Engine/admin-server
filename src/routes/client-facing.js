const { Router } = require("express");
const { getPropertyById, searchProperty } = require("../controllers/property-controller");
const validateSearchFilters = require("../middleware/validators/filters-validator");
const { validateJWT } = require("../middleware/stsauth-middleware");
const router = Router();

router.use(validateJWT);
router.get("/properties", validateSearchFilters, searchProperty);
router.get("/properties/:id", getPropertyById);

module.exports = router;