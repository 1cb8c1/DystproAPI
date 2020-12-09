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
router.get("/", async (req, res) => {
  try {
    const drivers = await DBdrivers.getDrivers(req.user.distributor);
    return res.status(200).send({ drivers: drivers });
  } catch (error) {
    return res.status(500).send({
      error: {
        code: CODES.DATABASE,
        message: "Database returned error",
      },
      drivers: null,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const driver = DBdrivers.getDriver(req.params.id, req.user.distributor);
    return res.status(200).send({ driver: driver });
  } catch (error) {
    return res.status(500).send({
      error: {
        code: CODES.DATABASE,
        message: "Database returned error",
      },
      driver: null,
    });
  }
});

router.post("/", async (req, res) => {
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
    return res.status(500).send({
      error: {
        code: CODES.DATABASE,
        message: "Database returned error",
      },
      driver: null,
    });
  }
});

router.delete("/:id", async (req, res) => {
  //TRYING TO REMOVE DRIVER
  try {
    await DBdrivers.removeDriver(req.params.id, req.user.distributor);
    return res.status(200).send({});
  } catch (error) {
    if (
      error instanceof sql.RequestError &&
      Object.prototype.hasOwnProperty.call(error, "number")
    ) {
      return res.status(500).send({
        code: CODES.DATABASE,
        message: DATABASE_ERRORS[error.number].MESSAGE,
      });
    } else {
      return res.status(500).send({
        error: {
          code: CODES.DATABASE,
          message: "Database returned error",
        },
      });
    }
  }
});

router.patch("/:id", async (req, res) => {
  //TRYING TO MODIFY DRIVER
  try {
    await DBdrivers.modifyDriver(
      req.params.id,
      req.body.driver.name,
      req.body.driver.surname,
      req.user.distributor
    );
  } catch (error) {
    if (
      error instanceof sql.RequestError &&
      Object.prototype.hasOwnProperty.call(error, "number")
    ) {
      return res(500).send({
        error: {
          code: CODES.DATABASE,
          message: DATABASE_ERRORS[error.number].MESSAGE,
        },
        driver: null,
      });
    } else {
      return res.status(500).send({
        error: {
          code: CODES.DATABASE,
          message: "Database returned error",
        },
        driver: null,
      });
    }
  }

  //TRYING TO GET MODIFIED DRIVER
  try {
    const driver = await DBdrivers.getDriver(
      req.params.id,
      req.user.distributor
    );
    return res.status(200).send({ driver: driver });
  } catch (error) {
    return res.status(500).send({
      error: {
        code: CODES.DATABASE,
        message: "Database returned error",
      },
      driver: null,
    });
  }
});

//EXPORTS
module.exports = router;
