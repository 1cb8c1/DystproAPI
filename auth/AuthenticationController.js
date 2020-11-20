const express = require("express");
const jwt = require("jsonwebtoken");
const { userExists, createUser, getUser } = require("../db/users");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { verifyToken, generateToken } = require("./Token");
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/register", async (req, res) => {
  try {
    await createUser(req.body.email, req.body.password);
    const token = generateToken(req.body.email);
    res.status(200).send({ auth: true, token: token });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const doesUserExists = await userExists(req.email);
    if (!doesUserExists) {
      throw new Error(`Email:${req.email} doesn't exist`);
    }

    const user = await getUser(req.email);

    if (user === undefined) {
      throw new Error(`User:${user} doesn't exist, but should. Strange...`);
    }

    delete user.password;
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ auth: false, message: error });
  }
});

router.post("/login", async (req, res) => {
  const doesUserExists = await userExists(req.body.email);
  try {
    if (!doesUserExists) {
      return res.status(404).send("Email doesn't exist");
    }

    const user = await getUser(req.body.email);
    //add if here

    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).send({ auth: false, token: null });
    }

    const token = generateToken(user.email);
    res.status(200).send({ auth: true, token: token });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/logout", (req, res) => {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;
