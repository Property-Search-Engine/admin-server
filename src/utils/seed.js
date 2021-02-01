const db = require("../models");

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// async function seed() {
//   const newUsers = await db.User.insertMany(USERS);

//   const newUsersIDs = newUsers.map((user) => user._id);

//   const recipesWithAuthor = RECIPES.map((recipe) => ({
//     ...recipe,
//     author: getRandomItem(newUsersIDs),
//   }));

//   const newRecipes = await db.Recipe.insertMany(recipesWithAuthor);

//   const newRecipesIDS = newRecipes.map((recipe) => recipe._id);

//   const newCommentsWithData = COMMENTS.map((comment) => ({
//     ...comment,
//     author: getRandomItem(newUsersIDs),
//     recipe: getRandomItem(newRecipesIDS),
//   }));

//   const newComments = await db.Comment.insertMany(newCommentsWithData);

//   newComments.forEach(async (comment) => {
//     await db.Recipe.findOneAndUpdate(
//       { _id: comment.recipe },
//       {
//         $push: {
//           comments: [comment._id],
//         },
//       },
//     );
//   });
// }

module.exports = seed;
