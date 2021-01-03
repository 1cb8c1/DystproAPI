//IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const DBdistributors = require("../models/distributors");
const { ROLES } = require("../utils/auth/Roles");

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
router.get("/discount", async (req, res, next) => {
  try {
    const discount = await DBdistributors.getDistributorDiscount(
      req.user.distributor
    );
    return res.status(200).send({ discount: discount });
  } catch (error) {
    error.onResponseData = { discount: null };
    return next(error);
  }
});

//EXPORTS
module.exports = router;
