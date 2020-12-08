const { CODES } = require("../errors/Errors");
const express = require("express");
const bodyParser = require("body-parser");
const {
  getDrivers,
  addDriver,
  removeDriver,
  modifyDriver,
  getDriver,
} = require("../db/drivers");
const {
  checkAuthorizationMiddleware,
} = require("../auth/AuthorizationMiddleware");
const { verifyTokenMiddleware } = require("../auth/AuthenticationMiddleware");
const { ROLES } = require("../auth/Roles");
const { createUser } = require("../db/users");

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use([
  verifyTokenMiddleware,
  checkAuthorizationMiddleware(ROLES.DISTRIBUTOR),
]);

router.get("/", async (req, res) => {
  try {
    const drivers = await getDrivers(req.user.distributor);
    return res.status(200).send({ drivers: drivers });
  } catch (innererror) {
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
    const driver = getDriver(req.params.id, req.user.distributor);
    return res.status(200).send({ driver: driver });
  } catch (innerError) {
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
  try {
    const driver = await addDriver(
      req.body.driver.name,
      req.body.driver.surname,
      req.user.distributor
    );

    return res.status(200).send({ driver: driver });
  } catch (innerError) {
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
  try {
    await removeDriver(req.params.id, req.user.distributor);
    return res.status(200).send({});
  } catch (innerError) {
    return res.status(500).send({
      error: {
        code: CODES.DATABASE,
        message: "Database returned error",
      },
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    await modifyDriver(
      req.params.id,
      req.body.driver.name,
      req.body.driver.surname,
      req.user.distributor
    );
    const driver = await getDriver(req.params.id, req.user.distributor);
    return res.status(200).send({ driver: driver });
  } catch (innerError) {
    return res.status(500).send({
      error: {
        code: CODES.DATABASE,
        message: "Database returned error",
      },
      driver: null,
    });
  }
});

module.exports = router;
