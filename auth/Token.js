const jwt = require("jsonwebtoken");

const generateToken = (email) => {
  return jwt.sign({ email: email }, process.env.SECRET, {
    expiresIn: 86400,
  });
};

module.exports = {
  generateToken,
};
