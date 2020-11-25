const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const { CODES } = require("../errors/Errors");

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).send({
      error: {
        code: CODES.BADARGUMENT,
        message: "No token provided.",
      },
      auth: false,
    });

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

const generateToken = (email) => {
  return jwt.sign({ email: email }, process.env.SECRET, {
    expiresIn: 86400,
  });
};

module.exports = {
  verifyToken,
  generateToken,
};
