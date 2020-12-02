const { userAuthorized } = require("../db/users");
const { CODES } = require("../errors/Errors");

const checkAuthorizationMiddleware = (role) => {
  return async (req, res, next) => {
    const user = req.user;

    //verifyTokenMiddleware checks if user exists. No need to to that here.

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
