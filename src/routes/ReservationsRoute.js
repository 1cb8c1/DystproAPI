//IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const DBreservations = require("../models/reservations");
const { ROLES } = require("../utils/auth/Roles");

//IMPORTING MIDDLEWARES
const authorizationMiddleware = require("../middlewares/AuthorizationMiddleware");
const authenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const requestValidationMiddleware = require("../middlewares/RequestValidationMiddleware");

//IMPORTING SCHEMAS
const schemas = require("../schemas/ReservationSchemas");

//SETTING UP ROUTER
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use([
  authenticationMiddleware,
  authorizationMiddleware(ROLES.DISTRIBUTOR),
]);

//ROUTES
router.post(
  "/",
  requestValidationMiddleware(schemas.reservationPostSchema, {
    reservation: null,
  }),
  async (req, res, next) => {
    try {
      const reservation = await DBreservations.createReservation(
        req.user.distributor,
        req.body.reservation.product_warehouse_id,
        req.body.reservation.amount
      );
      return res.status(200).send({ reservation });
    } catch (error) {
      error.onResponseData = { reservation: null };
      next(error);
    }
  }
);

router.delete(
  "/:id",
  requestValidationMiddleware(schemas.reservationDeleteSchema),
  async (req, res, next) => {
    try {
      await DBreservations.cancelReservation(
        req.params.id,
        req.user.distributor
      );
      return res.status(200).send({});
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", async (req, res, next) => {
  try {
    const reservations = await DBreservations.getDistributorReservations(
      req.user.distributor
    );
    return res.status(200).send({ reservations: reservations });
  } catch (error) {
    error.onResponseData = { reservations: null };
    next(error);
  }
});

router.get(
  "/:id",
  requestValidationMiddleware(schemas.reservationGetSchema, {
    reservation: null,
  }),
  async (req, res, next) => {
    try {
      const reservation = await DBreservations.getReservationById(
        req.params.id,
        req.user.distributor
      );
      return res.status(200).send({ reservation: reservation });
    } catch (error) {
      error.onResponseData = { reservation: null };
      next(error);
    }
  }
);

//EXPORTS
module.exports = router;
