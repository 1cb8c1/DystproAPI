//IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const DBdispatches = require("../models/dispatches");
const { ROLES } = require("../utils/auth/Roles");

//IMPORTING MIDDLEWARES
const authorizationMiddleware = require("../middlewares/AuthorizationMiddleware");
const authenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const requestValidationMiddleware = require("../middlewares/RequestValidationMiddleware");

//IMPORTING SCHEMAS
const schemas = require("../schemas/DispatchesSchemas");

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
  requestValidationMiddleware(schemas.dispatchPostSchema, {
    dispatch: null,
  }),
  async (req, res, next) => {
    try {
      const dispatch = await DBdispatches.createDispatch(
        req.user.distributor,
        req.body.dispatch.driver_id,
        req.body.dispatch.vehicle_id,
        req.body.dispatch.pickup_planned_date,
        req.body.dispatch.reservations_ids
      );
      return res.status(200).send({ dispatch: dispatch });
    } catch (error) {
      error.onResponseData = { dispatch: null };
      next(error);
    }
  }
);

router.get("/", async (req, res, next) => {
  try {
    const dispatches = await DBdispatches.getDispatches(req.user.distributor);
    return res.status(200).send({ dispatches: dispatches });
  } catch (error) {
    error.onResponseData = { dispatches: null };
    next(error);
  }
});

router.get(
  "/:id",
  requestValidationMiddleware(schemas.dispatchGetSchema, { dispatch: null }),
  async (req, res, next) => {
    try {
      const dispatch = await DBdispatches.getDispatch(
        req.user.distributor,
        req.params.id
      );
      return res.status(200).send({ dispatch: dispatch });
    } catch (error) {
      error.onResponseData = { dispatch: null };
      next(error);
    }
  }
);

router.delete(
  "/:id",
  requestValidationMiddleware(schemas.dispatchDeleteSchema),
  async (req, res, next) => {
    try {
      await DBdispatches.cancelDispatch(req.user.distributor, req.params.id);
      return res.status(200).send({});
    } catch (error) {
      next(error);
    }
  }
);

//EXPORTS
module.exports = router;
