//IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const DBproducts = require("../models/products");
const { ROLES } = require("../utils/auth/Roles");
const { CODES } = require("../errors/Errors");

//IMPORTING MIDDLEWARES
const authorizationMiddleware = require("../middlewares/AuthorizationMiddleware");
const authenticationMiddleware = require("../middlewares/AuthenticationMiddleware");

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
    const products = await DBproducts.getProductsNames(req.body.name);
    return res.status(200).send({ products: products });
  } catch (error) {
    return res.status(500).send({
      error: {
        code: CODES.DATABASE,
        message: "Database returned error",
      },
      products: null,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await DBproducts.getProductDetails(req.params.id);
    return res.status(200).send({ product: product });
  } catch (error) {
    return res.status(500).send({
      error: {
        code: CODES.DATABASE,
        message: "Database returned error",
      },
      product: null,
    });
  }
});

//EXPORTS
module.exports = router;
