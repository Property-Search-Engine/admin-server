const db = require("../models");

const USERS = [
  {
    name: "Ana Maria",
    lastname: "Perez",
    email: "ana@mail.com",
    password: "$2b$12$p0qK3HaiBvA1XIDXWaVS1e2Q7vFdAyGYZvlk/gaEo5Qk8RGBortMa",
  },
  {
    name: "Alex",
    lastname: "Marín",
    email: "alexm@mail.com",
    password: "$2b$12$wo2esw6AEnTNGvXXjxsGwO3I.kgS1CM86MnZgd/xrqixzMSwzW1KW",
  },
  {
    name: "Sergio",
    lastname: "Rio Mayor",
    email: "sergio22@mail.com",
    password: "$2b$12$dkZWNHosiTIKQBl8famUM.f2Te6Gq5/EzpQm6DDn71lqjZY79c71C",
  },
];

const RECIPES = [
  {
    name: "Ensalada de rape, palmito y naranja",
    description:
      "Si quieres introducir más pescado en tu dieta, aquí tienes una buena idea. Esta ensalada se elabora con una cola de rape, previamente horneada, y después se sirve en ensalada con palmitos y naranja.",
    difficulty: "Fácil",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80",
    serves: 4,
    ingredients: [
      "250g colas de rape",
      "3 naranjas",
      "1 bote palmito",
      "75g lechugas brotes variados",
      "6 cda salsa mayonesa",
      "cebollino unos tallos",
      "aceite de oliva",
      "sal",
      "pimienta negra",
    ],
    hoursToPrep: 1,
    minutesToPrep: 35,
  },
  {
    name: "Buddha bowl de lentejas, aguacate, rúcula y maíz",
    description:
      "El formato buddha bowl está de moda. Este lo hemos preparado con unas lentejas y mazorquitas cocidas y aguacate, rúcula, cebolla morada, un paté de aceitunas, piñones y almendras.",
    difficulty: "Fácil",
    image:
      "https://images.unsplash.com/photo-1505576633757-0ac1084af824?ixlib=rb-1.2.1&auto=format&fit=crop&w=1275&q=80",
    serves: 3,
    ingredients: [
      "20 mazorcas de maíz pequeñas y frescas",
      "2 aguacates",
      "400 g lentejas cocidas",
      "1 pimiento rojo",
      "1 cebolla morada",
      "½ limones el zumo",
      "100 g rúcula",
      "100 g piñones",
      "50 g almendras laminadas",
      "4 cda olivada",
    ],
    hoursToPrep: 0,
    minutesToPrep: 25,
  },
  {
    name: "Ensalada de frutas con limón",
    description:
      "Es una receta fácil, llena de vitaminas y que puedes hacer a tu gusto.",
    difficulty: "Media",
    image:
      "https://images.unsplash.com/photo-1568158879083-c42860933ed7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3333&q=80",
    serves: 4,
    ingredients: [
      "1 mango",
      "2 kiwi",
      "1 naranja grande",
      "2 plátanos",
      "1 limón",
    ],
    hoursToPrep: 0,
    minutesToPrep: 15,
  },
  {
    name: "Ensalada de espinacas y mango",
    description:
      "¿Puede haber algo más sano y sabroso que esta ensalada? Creemos que no. El mango es una fruta tropical que se cosecha sobre todo durante la primavera y el verano que tiene un muy dulce.",
    difficulty: "Fácil",
    image:
      "https://images.unsplash.com/photo-1562629609-49c10e58c2a6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3024&q=80",
    serves: 4,
    ingredients: [
      "1 mango",
      "1 bolsa de espinas",
      "1 cebolla roja",
      "Aceite de oliva",
      "1 limón",
    ],
    hoursToPrep: 0,
    minutesToPrep: 15,
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

async function seed() {
  const newUsers = await db.User.insertMany(USERS);

  const newUsersIDs = newUsers.map((user) => user._id);

  const recipesWithAuthor = RECIPES.map((recipe) => ({
    ...recipe,
    author: getRandomItem(newUsersIDs),
  }));

  const newRecipes = await db.Recipe.insertMany(recipesWithAuthor);

  const newRecipesIDS = newRecipes.map((recipe) => recipe._id);

  const newCommentsWithData = COMMENTS.map((comment) => ({
    ...comment,
    author: getRandomItem(newUsersIDs),
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

module.exports = seed;
