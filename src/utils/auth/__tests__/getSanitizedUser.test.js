const getSanitizedUser = require("../getSanitizedUser");

test("getSanitizedUser removes sensitive user information", () => {
  const initialUserData = {
    __v: 0,
    _id: "5edasmdasda90smd0asd0",
    id: "5edasmdasda90smd0asd0",
    password: "user_password",
    createdAt: "2020-03-19T09:22:12.423+00:00",
    updatedAt: "2020-03-19T09:22:12.423+00:00",
    name: "test user name",
    lastname: "test user lastname",
    email: "test@email.com",
    token: "test_token",
  };

  const expectedUserData = {
    _id: initialUserData._id,
    name: initialUserData.name,
    lastname: initialUserData.lastname,
    email: initialUserData.email,
  };

  const sanitizedUserData = getSanitizedUser(initialUserData);

  expect(sanitizedUserData).toEqual(expectedUserData);
});
