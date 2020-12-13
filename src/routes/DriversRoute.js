//IMPORTS
const { CODES, DATABASE_ERRORS } = require("../errors/Errors");
const express = require("express");
const bodyParser = require("body-parser");
const DBdrivers = require("../models/drivers");
const authorizationMiddleware = require("../middlewares/AuthorizationMiddleware");
const authenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const { ROLES } = require("../utils/auth/Roles");
const sql = require("mssql");

//SETTING UP ROUTER
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use([
  authenticationMiddleware,
  authorizationMiddleware(ROLES.DISTRIBUTOR),
]);

//ROUTES
router.get("/", async (req, res, next) => {
  try {
    const drivers = await DBdrivers.getDrivers(req.user.distributor);
    return res.status(200).send({ drivers: drivers });
  } catch (error) {
    error.onResponseData = { drivers: null };
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const driver = DBdrivers.getDriver(req.params.id, req.user.distributor);
    return res.status(200).send({ driver: driver });
  } catch (error) {
    error.onResponseData = { driver: null };
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  //CHECKING IF ARGUMENTS ARE CORRECT
  try {
    if (!Object.prototype.hasOwnProperty.call(req.body, "driver")) {
      throw new Error("No driver found");
    }
    if (!Object.prototype.hasOwnProperty.call(req.body.driver, "name")) {
      throw new Error("No name found");
    }
    if (!Object.prototype.hasOwnProperty.call(req.body.driver, "surname")) {
      throw new Error("No surnamename found");
    }
  } catch (error) {
    return res.status(400).send({
      error: {
        code: CODES.BADARGUMENT,
        message: error.message,
      },
      driver: null,
    });
  }

  //TRYING TO CREATE DRIVER
  try {
    const driver = await DBdrivers.addDriver(
      req.body.driver.name,
      req.body.driver.surname,
      req.user.distributor
    );

    return res.status(200).send({ driver: driver });
  } catch (error) {
    error.onResponseData = { driver: null };
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  //TRYING TO REMOVE DRIVER
  try {
    await DBdrivers.removeDriver(req.params.id, req.user.distributor);
    return res.status(200).send({});
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  //TRYING TO MODIFY DRIVER
  try {
    await DBdrivers.modifyDriver(
      req.params.id,
      req.body.driver.name,
      req.body.driver.surname,
      req.user.distributor
    );
  } catch (error) {
    error.onResponseData = { driver: null };
    return next(error);
  }

  //TRYING TO GET MODIFIED DRIVER
  try {
    const driver = await DBdrivers.getDriver(
      req.params.id,
      req.user.distributor
    );
    return res.status(200).send({ driver: driver });
  } catch (error) {
    error.onResponseData = { driver: null };
    return next(error);
  }
});

//EXPORTS
module.exports = router;
