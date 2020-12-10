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
  async (req, res) => {
    let request = null;
    try {
      request = await DBrequests.createRequest(req.user.user_id, req.body.info);
    } catch (error) {
      if (
        error instanceof sql.RequestError &&
        Object.prototype.hasOwnProperty.call(error, "number")
      ) {
        return res.status(409).send({
          error: {
            code: CODES.REJECTED,
            message: DATABASE_ERRORS[error.number].message,
          },
          request: null,
        });
      } else {
        return res.status(500).send({
          error: {
            code: CODES.DATABASE,
            message: "Databse returned error",
          },
          request: null,
        });
      }
    }
    return res.status(200).send({ request });
  }
);

//EXPORTS
module.exports = router;
