//IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const DBproducts = require("../models/products");
const { ROLES } = require("../utils/auth/Roles");
const { CODES } = require("../errors/Errors");

//IMPORTING MIDDLEWARES
const authorizationMiddleware = require("../middlewares/AuthorizationMiddleware");
const authenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const requestValidationMiddleware = require("../middlewares/RequestValidationMiddleware");

//IMPORTING schemas
const schemas = require("../schemas/ProductsSchemas");

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
    const products = await DBproducts.getProductsNames(req.body.name);
    return res.status(200).send({ products: products });
  } catch (error) {
    error.onResponseData = { products: null };
    return next(error);
  }
});

router.get(
  "/:id",
  requestValidationMiddleware(schemas.productsGetSchema, { product: null }),
  async (req, res, next) => {
    try {
      const product = await DBproducts.getProductDetails(req.params.id);
      return res.status(200).send({ product: product });
    } catch (error) {
      error.onResponseData = { product: null };
      return next(error);
    }
  }
);

//EXPORTS
module.exports = router;
