const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
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
