const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 14;

/*HASH IS 60 characters long*/
const generateHashedPassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, SALT_ROUNDS);
};

const isPasswordValid = (plainPassword, user) => {
  const passwordValid = bcrypt.compareSync(plainPassword, user.password);
  return passwordValid;
};

module.exports = {
  generateHashedPassword,
  isPasswordValid,
};
