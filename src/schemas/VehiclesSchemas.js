//IMPORTS
const joi = require("joi");

//SCHEMES
const vehiclesPostSchema = joi.object().keys({
  body: joi.object().keys({
    vehicle: joi
      .object()
      .keys({
        registration_number: joi.string().min(1).max(16).required(),
      })
      .required(),
  }),
  params: joi.object().optional(),
  query: joi.object().optional(),
});

const vehiclesGetSchema = joi.object().keys({
  body: joi.object().optional(),
  params: joi
    .object()
    .keys({
      id: joi.number().integer().required(),
    })
    .required(),
  query: joi.object().optional(),
});

const vehiclesDeleteSchema = joi.object().keys({
  body: joi.object().optional(),
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
  vehiclesPostSchema,
  vehiclesGetSchema,
  vehiclesDeleteSchema,
};
