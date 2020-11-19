const express = require("express");
const jwt = require("jsonwebtoken");
const { userExists, createUser } = require("../db/users");
const bodyParser = require("body-parser");
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/register", async (req, res) => {
  try {
    await createUser(req.body.email, req.body.password);
    const token = jwt.sign({ id: req.body.email }, "SECRET", {
      expiresIn: 86400,
    });
    res.status(200).send({ auth: true, token: token });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
