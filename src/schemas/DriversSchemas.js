//IMPORTS
const joi = require("joi");

//SCHEMES
const driversGetSchema = joi.object().keys({
  body: joi.object().optional(),
  params: joi
    .object()
    .keys({
      id: joi.number().integer().required(),
    })
    .required(),
  query: joi.object().optional(),
});

const driversPostSchema = joi.object().keys({
  body: joi
    .object()
    .keys({
      driver: joi
        .object()
        .keys({
          name: joi.string().min(1).max(32).required(),
          surname: joi.string().min(1).max(32).required(),
        })
        .required(),
    })
    .required(),
  params: joi.object().optional(),
  query: joi.object().optional(),
});

const driversDeleteSchema = joi.object().keys({
  body: joi.object().optional(),
  params: joi
    .object()
    .keys({
      id: joi.number().integer().required(),
    })
    .required(),
  query: joi.object().optional(),
});

const driversPatchSchema = joi.object().keys({
  body: joi
    .object()
    .keys({
      driver: joi
        .object()
        .keys({
          name: joi.string().min(1).max(32).optional(),
          surname: joi.string().min(1).max(32).optional(),
        })
        .required(),
    })
    .required(),
  params: joi
    .object()
    .keys({
      id: joi.number().integer().required(),
    })
    .required(),
  query: joi.object().optional(),
});
//EXPORTS
module.exports = {
  driversGetSchema,
  driversPostSchema,
  driversDeleteSchema,
  driversPatchSchema,
};
