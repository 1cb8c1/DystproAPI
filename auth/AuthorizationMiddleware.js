const { userExists, userAuthorized } = require("../db/users");
const { CODES } = require("../errors/Errors");

const checkAuthorizationMiddleware = (role) => {
  return async (req, res, next) => {
    const user = req.user;
    const doesUserExist = await userExists(user.id);

    if (!doesUserExist) {
      return res.status(422).send({
        error: {
          code: CODES.BADARGUMENT,
          message: "Authorization problem. Email doesn't exist",
        },
      });
    }

    const isAuthorized = await userAuthorized(user.id, role);
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

module.exports = { checkAuthorizationMiddleware };
