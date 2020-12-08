const CONFIG = require("../Config");
const { CODES } = require("../errors/Errors");
const jwt = require("jsonwebtoken");
const { getUserByID } = require("../db/users");

const verifyTokenMiddleware = async (req, res, next) => {
  //CHECKING IF TOKEN IS PROVIDED
  const token = req.get("x-access-token");
  if (!token)
    return res.status(401).send({
      error: {
        code: CODES.BADARGUMENT,
        message: "No token provided.",
      },
      auth: false,
    });

  try {
    const decoded = jwt.decode(token);

    //IF TOKEN DOESN'T HAVE user_id
    if (!Object.prototype.hasOwnProperty.call(decoded, "user_id")) {
      throw new Error("Decoded doesn't have user_id");
    }

    //IF USER DOESN'T EXIST
    const user = await getUserByID(decoded.user_id);
    if (user === undefined || user.user_id === undefined) {
      throw new Error("User not found");
    }

    //ALGORITHM MUST BE SPECIFIED! Otherwise it's vulnerability
    //If token's alg is different, error is thrown.
    jwt.verify(
      token,
      CONFIG.SECRET + user.password_creation_date,
      { algorithms: ["HS256"] },
      (err) => {
        if (err) {
          throw new Error("Failed to verify token");
        }
        req.user = user;
        next();
      }
    );
  } catch (error) {
    return res.status(401).send({
      error: {
        code: CODES.BADARGUMENT,
        message: "Failed to verify token.",
      },
      auth: false,
    });
  }
};

module.exports = {
  verifyTokenMiddleware,
};
