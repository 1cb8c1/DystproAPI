const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const { getProductsNames } = require("../db/products");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/names", async (req, res) => {
  try {
    const products = await getProductsNames(req.body.name);
    res.status(200).send({ products: products });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
