const { CODES } = require("../errors/Errors");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const { getProductsNames } = require("../db/products");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/names", async (req, res) => {
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

module.exports = router;
