const {
  userExists,
  createUser,
  getUser,
  userAuthorized,
} = require("../db/users");

const checkAuthorization = (role) => {
  return async (req, res, next) => {
    const email = req.email;
    const doesUserExist = await userExists(email);

    if (!doesUserExist) {
      return res.status(404).send("Email doesn't exist");
    }

    const isAuthorized = await userAuthorized(email, role);
    if (!isAuthorized) {
      return res.status(403).send("User not authorized");
    }
    next();
  };
};

module.exports = { checkAuthorization };
