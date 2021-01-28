const db = require("../../models");

function getTestUsers() {
  return [
    {
      user: {
        name: "Test User 1 Name",
        lastname: "Test User 1 Name",
        email: "testemail1@mail.com",
        password:
          "$2b$12$jkAt75qsYkXlypuLK7PEIuj9TIcnZFJbCdwjmGbfbgOBFpvitJysS",
      },
      unhashedPassword: "testpassword",
    },
    {
      user: {
        name: "Test User 2 Name",
        lastname: "Test User 2 Name",
        email: "testemail2@mail.com",
        password:
          "$2b$12$jkAt75qsYkXlypuLK7PEIuj9TIcnZFJbCdwjmGbfbgOBFpvitJysS",
      },
      unhashedPassword: "testpassword",
    },
    {
      user: {
        name: "Test User 3 Name",
        lastname: "Test User 3 Name",
        email: "testemail3@mail.com",
        password:
          "$2b$12$jkAt75qsYkXlypuLK7PEIuj9TIcnZFJbCdwjmGbfbgOBFpvitJysS",
      },
      unhashedPassword: "testpassword",
    },
    {
      user: {
        name: "Test User 4 Name",
        lastname: "Test User 4 Name",
        email: "testemail4@mail.com",
        password:
          "$2b$12$jkAt75qsYkXlypuLK7PEIuj9TIcnZFJbCdwjmGbfbgOBFpvitJysS",
      },
      unhashedPassword: "testpassword",
    },
  ];
}

const RECIPES = [
  {
    name: "Test Recipe 1 Title",
    description: "Test Recipe 1 Description",
    difficulty: "Fácil",
    image: "Test Recipe 1 Image 1",
    serves: 6,
    ingredients: ["Test Recipe 1 Ingredient 1", "Test Recipe 1 Ingredient 2"],
    hoursToPrep: 0,
    minutesToPrep: 40,
  },
  {
    name: "Test Recipe 2 Title",
    description: "Test Recipe 2 Description",
    difficulty: "Fácil",
    image: "Test Recipe 2 Image 1",
    serves: 4,
    ingredients: ["Test Recipe 2 Ingredient 1", "Test Recipe 2 Ingredient 2"],
    hoursToPrep: 0,
    minutesToPrep: 40,
  },
];

const COMMENTS = [
  {
    body:
      "Nos ha gustado muchísimo esta receta. Sin duda la volveremos a preparar.",
  },
  {
    body:
      "Es una receta que está bien. Va bien para cuando tienes prisa y no sabes qué cenar.",
  },
  {
    body: "A mis hijos les gusta, a mí no tanto.",
  },
  {
    body: "¡Muy buena!",
  },
  {
    body: "¡Nos ha encantado!",
  },
  {
    body: "Podría ser mejor...",
  },
  {
    body: "Regular",
  },
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedTestRecibesDB() {
  const testUser = getRecipesRoutesTestUser();

  const newUser = await db.User.create({
    ...testUser.user,
    password: testUser.unhashedPassword,
  });

  const recipesWithAuthor = RECIPES.map((recipe) => ({
    ...recipe,
    author: newUser._id,
  }));

  const newRecipes = await db.Recipe.insertMany(recipesWithAuthor);

  const newRecipesIDS = newRecipes.map((recipe) => recipe._id);

  const newCommentsWithData = COMMENTS.map((comment) => ({
    ...comment,
    author: newUser._id,
    recipe: getRandomItem(newRecipesIDS),
  }));

  const newComments = await db.Comment.insertMany(newCommentsWithData);

  newComments.forEach(async (comment) => {
    await db.Recipe.findOneAndUpdate(
      { _id: comment.recipe },
      {
        $push: {
          comments: [comment._id],
        },
      },
    );
  });
}

function getUsersRouteTestUser() {
  return getTestUsers()[0];
}

function getUserModelTestUser() {
  return getTestUsers()[1];
}

function getRecipesRoutesTestUser() {
  return getTestUsers()[2];
}

function getAuthenticatedTestUser() {
  return getRecipesRoutesTestUser();
}

async function getRecipeWithComments() {
  return await db.Recipe.findOne({
    $where: "this.comments.length > 1",
  });
}

module.exports = {
  seedTestRecibesDB,
  getAuthenticatedTestUser,
  getRecipeWithComments,
  getUsersRouteTestUser,
  getUserModelTestUser,
  getRecipesRoutesTestUser,
};
