const express = require("express");
const {
  userExists,
  emailExists,
  createUser,
  getUserByEmail,
  getUserByID,
} = require("../db/users");
const bodyParser = require("body-parser");
const { generateToken } = require("./Token");
const { verifyTokenMiddleware } = require("./AuthenticationMiddleware");
const { CODES } = require("../errors/Errors");
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const { isPasswordValid } = require("./Password");

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

  const emailTaken = await emailExists(req.body.email);
  if (emailTaken) {
    return res.status(422).send({
      error: {
        code: CODES.BADARGUMENT,
        message: "Email already taken.",
      },
      auth: false,
      token: null,
    });
  }

  //TODO check if user already exists
  const longEnough = req.body.password.length >= 8;
  const hasSmallLetter = req.body.password.match(/[a-z]/) !== null;
  const hasBigLetter = req.body.password.match(/[A-Z]/) !== null;
  const hasNumber = req.body.password.match(/[0-9]/) !== null;
  const hasSpecialCharacter = req.body.password.match(/[!@#$%^&*]/) !== null;

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
    const user = await getUserByEmail(req.body.email);
    //Add try catch here
    const token = generateToken(user);
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

router.get("/me", verifyTokenMiddleware, async (req, res) => {
  const user = req.user;
  delete user.password;
  return res.status(200).send({ user: user });
});

router.post("/login", async (req, res) => {
  const doesEmailExist = await emailExists(req.body.email);
  try {
    if (!doesEmailExist) {
      return res.status(422).send({
        error: {
          code: CODES.BADARGUMENT,
          message: "Wrong email or password",
        },
        auth: false,
        token: null,
      });
    }

    const user = await getUserByEmail(req.body.email);
    //add if here

    const passwordValid = isPasswordValid(req.body.password, user);

    if (!passwordValid) {
      return res.status(422).send({
        error: {
          code: CODES.BADARGUMENT,
          message: "Wrong email or password",
        },
        auth: false,
        token: null,
      });
    }

    const token = generateToken(user);
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

router.post("/changePassword", verifyTokenMiddleware, (req, res) => {});

module.exports = router;
