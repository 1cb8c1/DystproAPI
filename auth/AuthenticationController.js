const express = require("express");
const { userExists, createUser, getUser } = require("../db/users");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { verifyToken, generateToken } = require("./Token");
const { CODES } = require("../errors/Errors");
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const { isPasswordValid } = require("../auth/Password");

router.post("/register", async (req, res) => {
  if (req.body.email === undefined || req.body.password === undefined) {
    return res.status(400).send({
      error: {
        code: CODES.BADARGUMENT,
        message: "Missing one of the arguments needed for registration",
      },
      auth: false,
      token: null,
    });
  }

  const longEnough = req.body.password.length >= 8;
  const hasSmallLetter = req.body.password.match("/[a-z]/g");
  const hasBigLetter = req.body.password.match("/[A-Z]/g");
  const hasNumber = req.body.password.match("[0-9]/g");
  const hasSpecialCharacter = req.body.password.match("/[^a-zA-Zd]/g");
  if (
    !longEnough ||
    !hasSmallLetter ||
    !hasBigLetter ||
    !hasNumber ||
    !hasSpecialCharacter
  ) {
    return res.status(422).send({
      error: {
        code: CODES.BADARGUMENT,
        message: "Password isn't strong enough",
        details: {
          longEnough: longEnough,
          hasSmallLetter: hasSmallLetter,
          hasBigLetter: hasBigLetter,
          hasNumber: hasNumber,
          hasSpecialCharacter: hasSpecialCharacter,
        },
      },
      auth: false,
      token: null,
    });
  }

  try {
    await createUser(req.body.email, req.body.password);
    const token = generateToken(req.body.email);
    return res.status(200).send({ auth: true, token: token });
  } catch (innererror) {
    console.log(innererror);
    return res.status(500).send({
      error: {
        code: CODES.DATABASE,
        message: "Database returned error",
      },
      auth: false,
      token: null,
    });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const doesUserExists = await userExists(req.email);
    if (!doesUserExists) {
      return res.status(422).send({
        error: {
          code: CODES.BADARGUMENT,
          message: "Such email doesn't exist, did you use correct token?",
        },
        user: null,
      });
    }

    const user = await getUser(req.email);

    if (user === undefined) {
      return res.status(500).send({
        error: {
          code: CODES.LOGIC,
          message: "For some reason email couldn't have been retrived",
        },
        user: null,
      });
    }

    delete user.password;
    return res.status(200).send({ user: user });
  } catch (error) {
    return res.status(500).send({
      error: {
        code: CODES.DATABASE,
        message: "Database returned error",
      },
      user: null,
    });
  }
});

router.post("/login", async (req, res) => {
  const doesUserExists = await userExists(req.body.email);
  try {
    if (!doesUserExists) {
      return res.status(422).send({
        error: {
          code: CODES.BADARGUMENT,
          message: "User doesn't exist",
        },
        auth: false,
        token: null,
      });
    }

    const user = await getUser(req.body.email);
    //add if here

    const passwordValid = isPasswordValid(req.body.password, user);

    if (!passwordValid) {
      return res.status(422).send({
        error: {
          code: CODES.BADARGUMENT,
          message: "Wrong password",
        },
        auth: false,
        token: null,
      });
    }

    const token = generateToken(user.email);
    res.status(200).send({ auth: true, token: token });
  } catch (innererror) {
    console.log(innererror);
    return res.status(500).send({
      error: {
        code: CODES.DATABASE,
        message: "Database returned error",
      },
      auth: false,
      token: null,
    });
  }
});

router.get("/logout", (req, res) => {
  res.status(200).send({ auth: false, token: null });
});

router.post("/resetPassword", (req, res) => {});

router.post("/changePassword", verifyToken, (req, res) => {});

module.exports = router;
