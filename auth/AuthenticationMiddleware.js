const CONFIG = require("../Config");
const { CODES } = require("../errors/Errors");
const jwt = require("jsonwebtoken");
const { getUserByID } = require("../db/users");

const verifyTokenMiddleware = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).send({
      error: {
        code: CODES.BADARGUMENT,
        message: "No token provided.",
      },
      auth: false,
    });

  const decoded = jwt.decode(token);

  const user = await getUserByID(decoded.user_id);
  //If user doesn't exist. Should It be checked with userExists too?
  if (user === undefined || user.user_id === undefined) {
    return res.status(401).send({
      error: {
        code: CODES.BADARGUMENT,
        message: "Failed to verify token.",
      },
      auth: false,
    });
  }

  //ALGORITHM MUST BE SPECIFIED! Otherwise it's vulnerability
  //If token's alg is different, error is thrown.
  jwt.verify(
    token,
    CONFIG.SECRET + user.password_creation_date,
    { algorithms: ["HS256"] },
    (err, decoded) => {
      if (err) {
        return res.status(401).send({
          error: {
            code: CODES.BADARGUMENT,
            message: "Failed to verify token.",
          },
          auth: false,
        });
      }

      req.user = user;
      next();
    }
  );
};

module.exports = {
  verifyTokenMiddleware,
};
