//IMPORTS
const { userAuthorized } = require("../models/users");
const { CODES } = require("../errors/Errors");

//Functions
const authorizationMiddleware = (role) => {
  return async (req, res, next) => {
    const user = req.user;

    const isAuthorized = await userAuthorized(user.user_id, role);
    if (!isAuthorized) {
      return res.status(403).send({
        error: {
          code: CODES.NOTAUTHORIZED,
          message: "User not authorized",
        },
      });
    }
    next();
  };
};

//Exports
module.exports = authorizationMiddleware;
