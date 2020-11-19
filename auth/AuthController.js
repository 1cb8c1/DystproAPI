const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
});
