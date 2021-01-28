const passport = require("passport");
const { Router } = require("express");

const recipesRouter = Router();

const recipesController = require("../controllers/recipe-controller");

recipesRouter.get("/recipes", recipesController.getRecipes);

recipesRouter.get("/recipes/:recipeID", recipesController.getRecipe);

recipesRouter.post(
  "/recipes/:recipeID/comment",
  passport.authenticate("jwt", { session: false }),
  recipesController.addRecipeComment,
);

recipesRouter.delete(
  "/recipes/:recipeID/:commentID",
  passport.authenticate("jwt", { session: false }),
  recipesController.deleteRecipeComment,
);

module.exports = recipesRouter;
