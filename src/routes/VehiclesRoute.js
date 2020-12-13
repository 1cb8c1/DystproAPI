//IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const DBvehicles = require("../models/vehicles");
const authorizationMiddleware = require("../middlewares/AuthorizationMiddleware");
const authenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const requestValidationMiddleware = require("../middlewares/RequestValidationMiddleware");
const schemas = require("../schemas/VehiclesSchemas");
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
    const vehicles = await DBvehicles.getVehicles(req.user.distributor);
    return res.status(200).send({ vehicles: vehicles });
  } catch (error) {
    error.onResponseData = { vehicles: null };
    return next(error);
  }
});

router.get(
  "/:id",
  requestValidationMiddleware(schemas.vehiclesGetSchema),
  async (req, res, next) => {
    try {
      const vehicle = await DBvehicles.getVehicle(
        req.params.id,
        req.user.distributor
      );
      return res.status(200).send({ vehicle: vehicle });
    } catch (error) {
      error.onResponseData = { vehicle: null };
      return next(error);
    }
  }
);

router.post(
  "/",
  requestValidationMiddleware(schemas.vehiclesPostSchema),
  async (req, res, next) => {
    try {
      const vehicle = await DBvehicles.addVehicle(
        req.body.vehicle.registration_number,
        req.user.distributor
      );
      return res.status(200).send({ vehicle: vehicle });
    } catch (error) {
      error.onResponseData({ vehicle: null });
      return next(error);
    }
  }
);

router.delete(
  "/:id",
  requestValidationMiddleware(schemas.vehiclesDeleteSchema),
  async (req, res, next) => {
    try {
      await DBvehicles.removeVehicle(req.params.id, req.user.distributor);
      return res.status(200).send({});
    } catch (error) {
      return next(error);
    }
  }
);

//EXPORTS
module.exports = router;
