const db = require("../../models");

const property = {
  price: 200000,
  description: "This is the house of your dreams",
  filters: ["petsAllowed"],
  images: ["https://geekculture.co/wp-content/uploads/2019/12/Pickle-Rick-3.jpeg"],
  address: {
    street: "C/Sant Antoni",
    number: 50,
    city: "Cerdañola del Vallés",
    state: "Catalonia",
    country: "Spain",
    coordinates: {
      lat: 0.1234,
      long: 1.2314
    }
  },
  contactInfo: {
    _id: "5d6ede6a0ba62570afcedd3a",
    phone: "7569283938",
    email: "patata@mail.com"
  },
}

const propertyMin = {
  price: 200000,
  image: "https://geekculture.co/wp-content/uploads/2019/12/Pickle-Rick-3.jpeg",
  address: {
    street: "C/Sant Antoni",
    number: 50,
    city: "Cerdañola del Vallés",
    state: "Catalonia",
    country: "Spain",
    coordinates: {
      lat: 0.1234,
      long: 1.2314
    }
  },
}

function getTestProperties() {
  return [
    {
      kind: "Home",
      homeType: "house",
      bedRooms: 3,
      bathRooms: 2,
      equipment: "indifferent",
      condition: "newHome",
      surface: 200,
      ...property
    },
    {
      kind: "Office",
      buildingUse: "coWorking",
      ...property
    }
  ];
}

function getTestEmployeeProperties() {
  return [
    {
      _id: "601829717ad3a0017f2eb8af",
      kind: "Home",
      bedRooms: 3,
      bathRooms: 2,
      surface: 200,
      ...propertyMin
    },
    {
      _id: "601829717ad3a0017f2eb8bf",
      kind: "Office",
      buildingUse: "coWorking",
      ...propertyMin
    }
  ];
}

function getTestEmployees() {
  return [
    {
      _id: "5d6ede6a0ba62570afcedd3a",
      firstname: "Home",
      lastname: "house",
      email: "asdasdad@asdasd.com",
      phone: "323-2423-123",
    },
    {
      _id: "5d6ede6a0ba62570afcedd3b",
      firstname: "Home",
      lastname: "house",
      email: "asdasdad@asdasd.com",
      phone: "323-2423-123",
      properties: []
    },
    {
      _id: "5d6ede6a0ba62570afcedd3c",
      firstname: "Home",
      lastname: "house",
      email: "asdasdad@asdasd.com",
      phone: "323-2423-123",
      properties: getTestEmployeeProperties()
    },
  ];
}

// async function seedTestRecibesDB() {
//   const testUser = getRecipesRoutesTestUser();

//   const newUser = await db.User.create({
//     ...testUser.user,
//     password: testUser.unhashedPassword,
//   });

//   const recipesWithAuthor = RECIPES.map((recipe) => ({
//     ...recipe,
//     author: newUser._id,
//   }));

//   const newRecipes = await db.Recipe.insertMany(recipesWithAuthor);

//   const newRecipesIDS = newRecipes.map((recipe) => recipe._id);

//   const newCommentsWithData = COMMENTS.map((comment) => ({
//     ...comment,
//     author: newUser._id,
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

// async function getRecipeWithComments() {
//   return await db.Recipe.findOne({
//     $where: "this.comments.length > 1",
//   });
// }

function getHome() {
  return getTestProperties()[0];
}

function getOffice() {
  return getTestProperties()[1];
}

module.exports = {
  getTestProperties,
  getHome,
  getOffice
};
