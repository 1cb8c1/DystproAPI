const SECRET = process.env.SECRET;
const { CODES } = require("../errors/Errors");

const verifyTokenMiddleware = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).send({
      error: {
        code: CODES.BADARGUMENT,
        message: "No token provided.",
      },
      auth: false,
    });

  //CHECK ALGORITHM!!! MIGHT BE A VULNEBIRITY
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        error: {
          code: CODES.BADARGUMENT,
          message: "Failed to verify token.",
        },
        auth: false,
      });
    }

    req.email = decoded.email;
    next();
  });
};

module.exports = {
  verifyTokenMiddleware,
};
