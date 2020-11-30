const jwt = require("jsonwebtoken");
const CONFIG = require("../Config");

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id },
    CONFIG.SECRET + user.password_creation_date,
    {
      expiresIn: 86400,
    }
  );
};

module.exports = {
  generateToken,
};
