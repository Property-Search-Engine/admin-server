const db = require("../models");

async function getRecipes(req, res, next) {
  const recipes = await db.Recipe.find({})
    .sort({ _id: -1 })
    .limit(10)
    .select(
      "_id name description difficulty image serves hoursToPrep minutesToPrep",
    )
    .lean()
    .exec()
    .catch(next);

  res.status(200).send({
    data: recipes,
    error: null,
  });
}

async function getRecipe(req, res, next) {
  const recipeID = req.params.recipeID;

  const recipe = await db.Recipe.findById(recipeID)
    .populate("author", "_id name lastname")
    .populate({
      path: "comments",
      select: "-__v -id -createdAt -updatedAt",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "author",
        select: "_id name lastname",
      },
    })
    .select("-__v")
    .lean()
    .exec()
    .catch(next);

  if (recipe) {
    res.status(200).send({
      data: recipe,
      error: null,
    });
  } else {
    res.status(404).send({
      data: null,
      error: "Recipe not found",
    });
  }
}

async function addRecipeComment(req, res, next) {
  const { commentBody } = req.body;
  const { recipeID } = req.params;
  const { user } = req;

  if (!user._id) {
    return res.status(401).send({
      data: null,
      error: "Unauthorized",
    });
  }

  if (!commentBody) {
    return res.status(400).send({
      data: null,
      error: "Missing fields",
    });
  }

  const recipe = await db.Recipe.findById(recipeID).catch(next);

  const comment = await db.Comment.create({
    author: user._id,
    body: commentBody,
    recipe: recipeID,
  }).catch(next);

  recipe.comments.push(comment._id);

  await recipe.save().catch(next);

  await comment
    .populate({
      path: "author",
      select: " name lastname",
    })
    .execPopulate()
    .catch(next);

  const {
    __v,
    id,
    createdAt,
    updatedAt,
    ...sanitizedComment
  } = comment.toObject();

  res.status(201).send({
    data: sanitizedComment,
    error: null,
  });
}

async function deleteRecipeComment(req, res, next) {
  const { commentID, recipeID } = req.params;

  const deleteComment = db.Comment.findByIdAndDelete(commentID);

  const deleteRecipeComment = db.Recipe.findByIdAndUpdate(recipeID, {
    $pull: {
      comments: {
        $in: [commentID],
      },
    },
  });

  await Promise.all([
    deleteComment.catch(next),
    deleteRecipeComment.catch(next),
  ]).catch(next);

  res.status(200).send({
    data: "Ok",
    error: null,
  });
}

module.exports = {
  getRecipes,
  getRecipe,
  addRecipeComment,
  deleteRecipeComment,
};
