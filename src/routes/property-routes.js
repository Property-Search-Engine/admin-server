const passport = require("passport");
const { Router } = require("express");

const propertyRouter = Router();

const { getPropertyById, createProperty, searchProperty } = require("../controllers/property-controller");
const { validateSearchFilters } = require("../middleware/validators/properties-validator");

propertyRouter.get("/:propertyID", getPropertyById);

propertyRouter.post("/", createProperty);

propertyRouter.get("/", validateSearchFilters, searchProperty);

// recipesRouter.get("/recipes", recipesController.getRecipes);
// recipesRouter.get("/recipes/:recipeID", recipesController.getRecipe);
// recipesRouter.post(
//   "/recipes/:recipeID/comment",
//   passport.authenticate("jwt", { session: false }),
//   recipesController.addRecipeComment,
// );
// recipesRouter.delete(
//   "/recipes/:recipeID/:commentID",
//   passport.authenticate("jwt", { session: false }),
//   recipesController.deleteRecipeComment,
// );

module.exports = propertyRouter;
