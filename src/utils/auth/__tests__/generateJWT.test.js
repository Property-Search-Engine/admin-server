jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "jwt_token_result"),
}));

const generateJWT = require("../generateJWT");

test("generateJWT creates a valid jwt token", () => {
  const userID = "5easnd0asdasd0ads09dnas";
  const next = jest.fn();

  const token = generateJWT(userID, next);

  expect(next).not.toHaveBeenCalled();
  expect(token).toBe("jwt_token_result");
});
