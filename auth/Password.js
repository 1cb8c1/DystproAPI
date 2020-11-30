const bcrypt = require("bcryptjs");
const SALT = 8;

const generateHashedPassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, SALT);
};

module.exports = {
  generateHashedPassword,
};
