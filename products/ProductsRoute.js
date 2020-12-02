const { CODES } = require("../errors/Errors");
const express = require("express");
const bodyParser = require("body-parser");
const { getProductsNames, getProductDetails } = require("../db/products");

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", async (req, res) => {
  try {
    const products = await getProductsNames(req.body.name);
    return res.status(200).send({ products: products });
  } catch (innererror) {
    return res.status(500).send({
      error: {
        code: CODES.DATABASE,
        message: "Database returned error",
        innererror: innererror,
      },
      products: null,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await getProductDetails(req.params.id);
    return res.status(200).send({ product: product });
  } catch (innerError) {
    return res.status(500).send({
      error: {
        code: CODES.DATABASE,
        message: "Database returned error",
      },
      product: null,
    });
  }
});

module.exports = router;
