//IMPORTS
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 14; //DETERMINES HOW LONG IT TAKES TO GET A HASH
//SALT PREVENTS RAINBOW TABLE ATTACKS

//FUNCTIONS
/*HASH IS 60 characters long*/
const generateHashedPassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, SALT_ROUNDS);
};

const isPasswordValid = (plainPassword, user) => {
  const passwordValid = bcrypt.compareSync(plainPassword, user.password);
  return passwordValid;
};

//EXPORTS
module.exports = {
  generateHashedPassword,
  isPasswordValid,
};
