const bcrypt = require("bcryptjs");
const SALT = 12;

/*HASH IS 60 characters long*/
const generateHashedPassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, SALT);
};

const isPasswordValid = (plainPassword, user) => {
  const passwordValid = bcrypt.compareSync(plainPassword, user.password);
  return passwordValid;
};

module.exports = {
  generateHashedPassword,
  isPasswordValid,
};
