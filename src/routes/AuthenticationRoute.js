//IMPORTS
const express = require("express");
const bodyParser = require("body-parser");

//MIDDLEWARES
const authenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const requestValidationMiddleware = require("../middlewares/RequestValidationMiddleware");
//DB
const DBips = require("../models/ips");
const { emailExists, createUser, getUserByEmail } = require("../models/users");
const sql = require("mssql");
const DBusers = require("../models/users");
//AUTH
const { generateToken } = require("../utils/auth/Token");
const { isPasswordValid } = require("../utils/auth/Password");
const { CODES } = require("../errors/Errors");
//NETWORKING
const ips = require("../utils/networking/Ips");
//SCHEMAS
const schemas = require("../schemas/AuthSchemas");

//SETTING UP ROUTER
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//ROUTES
router.post(
  "/register",
  requestValidationMiddleware(schemas.registerPostSchema, {
    auth: false,
    token: null,
  }),
  async (req, res, next) => {
    //CHECKS IF email IS TAKEN
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

    //CHECKS IF PASSWORD IS SECURE ENOUGH
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

    //TRIES TO GENERATE USER AND RETURN TOKEN
    try {
      await createUser(req.body.email, req.body.password);
      const user = await getUserByEmail(req.body.email);
      const token = generateToken(user);
      return res.status(200).send({ auth: true, token: token });
    } catch (error) {
      error.onResponseData = { auth: null, token: null };
      return next(error);
    }
  }
);

//RETURNS INFO ABOUT USER
router.get("/me", authenticationMiddleware, async (req, res) => {
  const user = req.user;
  delete user.password;
  return res.status(200).send({ user: user });
});

router.post(
  "/login",
  requestValidationMiddleware(schemas.loginPostSchema, {
    auth: null,
    token: null,
  }),
  async (req, res, next) => {
    //FAIL2BAN CHECK
    const banishedIps = await DBips.getBanishedIpsFromLogin();
    if (banishedIps.includes(ips.removePort(req.ip))) {
      return res.status(403).send({
        error: {
          code: CODES.REJECTED,
          message: "Too many failed login attempts",
        },
        auth: false,
        token: null,
      });
    }

    //GETTING USER
    let user;
    try {
      user = await getUserByEmail(req.body.email);
    } catch (error) {
      if (
        (error instanceof sql.RequestError ||
          error instanceof sql.PreparedStatementError) &&
        error.code === "EINJECT"
      ) {
        //USER TRIED SQL INJECTION. ADDING FAILURE TO TABLE WITH IPS
        try {
          DBips.insertFailedLogin(req.ip);
        } catch (insertFailerLoginError) {
          console.log(insertFailerLoginError);
        }
        return res.status(422).send({
          error: {
            code: CODES.BADARGUMENT,
            message: "Wrong email or password",
          },
          auth: false,
          token: null,
        });
      }

      //IF NOT SQL INJECTION, RETURNS DATABASE ERROR
      error.onResponseData = { auth: null, token: null };
      return next(error);
    }

    //IF USER DOESN'T EXIST
    if (
      user === undefined ||
      user === null ||
      (Object.keys(user).length === 0 && user.constructor === Object)
    ) {
      //ADDING FAILURE TO TABLE WITH IPS
      try {
        DBips.insertFailedLogin(req.ip);
      } catch (insertFailerLoginError) {
        console.log(insertFailerLoginError);
      }
      return res.status(422).send({
        error: {
          code: CODES.BADARGUMENT,
          message: "Wrong email or password",
        },
        auth: false,
        token: null,
      });
    }

    const passwordValid = isPasswordValid(req.body.password, user);

    if (!passwordValid) {
      //USER TRIED SQL INJECTION. ADDING FAILURE TO TABLE WITH IPS
      try {
        DBips.insertFailedLogin(req.ip);
      } catch (insertFailerLoginError) {
        console.log(insertFailerLoginError);
      }
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
  }
);

router.get("/logout", (req, res) => {
  res.status(200).send({ auth: false, token: null });
});

router.get("/me/roles", authenticationMiddleware, async (req, res, next) => {
  try {
    const roles = await DBusers.getUserRoles(req.user.user_id);
    return res.status(200).send({ roles });
  } catch (error) {
    error.onResponseData = { roles: null };
    return next(error);
  }
});

/* TODO
router.post("/resetPassword", (req, res) => {});

router.post("/changePassword", authenticationMiddleware, (req, res) => {});
*/

module.exports = router;
