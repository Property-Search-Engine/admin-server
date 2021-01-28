function getSanitizedUser(userObj) {
  const {
    __v,
    id,
    password: userPassword,
    createdAt,
    updatedAt,
    token,
    ...sanitizedUser
  } = userObj;

  return sanitizedUser;
}

module.exports = getSanitizedUser;
