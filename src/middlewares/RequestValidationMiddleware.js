//IMPORTS
const { CODES } = require("../errors/Errors");

//FUNCTIONS
const requestValidationMiddleware = (schema, returnOnError = null) => {
  return (req, res, next) => {
    const { error } = schema.validate({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");

      res.status(422).send({
        error: {
          code: CODES.BADARGUMENT,
          message: message,
        },
        ...returnOnError,
      });
    }
  };
};

//EXPORTS
module.exports = requestValidationMiddleware;
