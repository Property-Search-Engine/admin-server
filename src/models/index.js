const UserModel = require("./user-model");
const RecipeModel = require("./recipe-model");
const CommentModel = require("./comment-model");

module.exports = {
  User: UserModel,
  Recipe: RecipeModel,
  Comment: CommentModel,
};
