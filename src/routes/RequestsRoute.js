//IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const DBrequests = require("../models/requests");
const { ROLES } = require("../utils/auth/Roles");
const { CODES, DATABASE_ERRORS } = require("../errors/Errors");
const sql = require("mssql");

//IMPORTING MIDDLEWARES
const authorizationMiddleware = require("../middlewares/AuthorizationMiddleware");
const authenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const requestValidationMiddleware = require("../middlewares/RequestValidationMiddleware");

//IMPORTING SCHEMES
const requestsSchemes = require("../schemas/RequestsSchemes");

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
  requestValidationMiddleware(requestsSchemes.requestsPostSchema, {
    request: null,
  }),
  async (req, res, next) => {
    let request = null;
    try {
      request = await DBrequests.createRequest(req.user.user_id, req.body.info);
    } catch (error) {
      error.onResponseData = { request: null };
      return next(error);
    }
    return res.status(200).send({ request });
  }
);

//EXPORTS
module.exports = router;
