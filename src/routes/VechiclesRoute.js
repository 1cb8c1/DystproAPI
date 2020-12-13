//IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const DBvechicles = require("../models/vechicles");
const authorizationMiddleware = require("../middlewares/AuthorizationMiddleware");
const authenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const requestValidationMiddleware = require("../middlewares/RequestValidationMiddleware");
const schemes = require("../schemas/VechiclesSchemes");
const { ROLES } = require("../utils/auth/Roles");

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
    const vechicles = await DBvechicles.getVechicles(req.user.distributor);
    return res.status(200).send({ vechicles: vechicles });
  } catch (error) {
    error.onResponseData = { vechicles: null };
    return next(error);
  }
});

router.get(
  "/:id",
  requestValidationMiddleware(schemes.vechiclesGetSchema),
  async (req, res, next) => {
    try {
      const vechicle = await DBvechicles.getVechicle(
        req.params.id,
        req.user.distributor
      );
      return res.status(200).send({ vechicle: vechicle });
    } catch (error) {
      error.onResponseData = { vechicle: null };
      return next(error);
    }
  }
);

router.post(
  "/",
  requestValidationMiddleware(schemes.vechiclesPostSchema),
  async (req, res, next) => {
    try {
      const vechicle = await DBvechicles.addVechicle(
        req.body.vechicle.registration_number,
        req.user.distributor
      );
      return res.status(200).send({ vechicle: vechicle });
    } catch (error) {
      error.onResponseData({ vechicle: null });
      return next(error);
    }
  }
);

router.delete(
  "/:id",
  requestValidationMiddleware(schemes.vechiclesDeleteSchema),
  async (req, res, next) => {
    try {
      await DBvechicles.removeVechicle(req.params.id, req.user.distributor);
      return res.status(200).send({});
    } catch (error) {
      return next(error);
    }
  }
);

//EXPORTS
module.exports = router;
