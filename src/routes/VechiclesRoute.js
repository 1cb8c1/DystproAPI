//IMPORTS
const { CODES, DATABASE_ERRORS } = require("../errors/Errors");
const express = require("express");
const bodyParser = require("body-parser");
const DBvechicles = require("../models/vechicles");
const authorizationMiddleware = require("../middlewares/AuthorizationMiddleware");
const authenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const requestValidationMiddleware = require("../middlewares/RequestValidationMiddleware");
const schemes = require("../schemas/VechiclesSchemes");
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
    const vechicles = await DBvechicles.getVechicles(req.user.distributor);
    return res.status(200).send({ vechicles: vechicles });
  } catch (error) {
    return res.status(500).send({
      error: {
        code: CODES.DATABASE,
        message: "Database returned error",
      },
      vechicles: null,
    });
  }
});

router.get(
  "/:id",
  requestValidationMiddleware(schemes.vechiclesGetSchema),
  async (req, res) => {
    try {
      const vechicle = await DBvechicles.getVechicle(
        req.params.id,
        req.user.distributor
      );
      return res.status(200).send({ vechicle: vechicle });
    } catch (error) {
      return res.status(500).send({
        error: {
          code: CODES.DATABASE,
          message: "Database returned error",
        },
        vechicle: null,
      });
    }
  }
);

router.post(
  "/",
  requestValidationMiddleware(schemes.vechiclesPostSchema),
  async (req, res) => {
    try {
      const vechicle = await DBvechicles.addVechicle(
        req.body.vechicle.registration_number,
        req.user.distributor
      );
      return res.status(200).send({ vechicle: vechicle });
    } catch (error) {
      return res.status(500).send({
        error: {
          code: CODES.DATABASE,
          message: "Database returned error",
        },
        vechicle: null,
      });
    }
  }
);

router.delete(
  "/:id",
  requestValidationMiddleware(schemes.vechiclesDeleteSchema),
  async (req, res) => {
    try {
      await DBvechicles.removeVechicle(req.params.id, req.user.distributor);
      return res.status(200).send({});
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        error: {
          code: CODES.DATABASE,
          message: "Database returned error",
        },
      });
    }
  }
);

//EXPORTS
module.exports = router;
