//IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const DBwarehouses = require("../models/warehouses");
const authorizationMiddleware = require("../middlewares/AuthorizationMiddleware");
const authenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const requestValidationMiddleware = require("../middlewares/RequestValidationMiddleware");
const schemas = require("../schemas/WarehousesSchemas");
const { ROLES } = require("../utils/auth/Roles");

//SETTING UP ROUTER
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use([authenticationMiddleware, authorizationMiddleware(ROLES.STOCKMAN)]);

//ROUTES
router.get(
  "/:name",
  requestValidationMiddleware(schemas.warehousesGetSchema, { warehouse: null }),
  async (req, res, next) => {
    try {
      const warehouse = await DBwarehouses.getWarehouseByName(req.params.name);
      return res.status(200).send({ warehouse: warehouse });
    } catch (error) {
      error.onResponseData = { warehouse: null };
      next(error);
    }
  }
);

router.get("/", async (req, res, next) => {
  try {
    const warehouses = await DBwarehouses.getAllWarehouses();
    return res.status(200).send({ warehouses: warehouses });
  } catch (error) {
    error.onResponseData = { warehouses: null };
    next(error);
  }
});

router.delete(
  "/:name",
  requestValidationMiddleware(schemas.warehousesDeleteSchema),
  async (req, res, next) => {
    try {
      await DBwarehouses.deleteWarehouse(req.params.name);
      return res.status(200).send({});
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  requestValidationMiddleware(schemas.warehousesPostSchema),
  async (req, res, next) => {
    try {
      const warehouse = await DBwarehouses.createWarehouse(
        req.body.warehouse.name,
        req.body.warehouse.city,
        req.body.warehouse.street
      );
      return res.status(200).send({ warehouse: warehouse });
    } catch (error) {
      error.onResponseData = { warehouse: null };
      next(error);
    }
  }
);

router.patch(
  "/:name",
  requestValidationMiddleware(schemas.warehousesPatchSchema, {
    warehouse: null,
  }),
  async (req, res, next) => {
    try {
      const warehouse = await DBwarehouses.reopenWarehouse(req.params.name);
      return res.status(200).send({ warehouse: warehouse });
    } catch (error) {
      error.onResponseData = { warehouse: null };
      next(error);
    }
  }
);

//EXPORTS
module.exports = router;
