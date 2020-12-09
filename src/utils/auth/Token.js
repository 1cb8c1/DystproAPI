//IMPORTS
const jwt = require("jsonwebtoken");
const CONFIG = require("../../../Config");

//FUNCTIONS
//USES DEFAULT HMAC SHA256
//PASSWORD_CREATION_DATE IS USED, UPON CHANGING PASSWORD, TOKEN BECOMES INVALID
const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id },
    CONFIG.SECRET + user.password_creation_date,
    {
      expiresIn: 86400,
    }
  );
};

//EXPORTS
module.exports = {
  generateToken,
};
