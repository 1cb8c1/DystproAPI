//IMPORTS
const joi = require("joi");

//SCHEMES
const vechiclesPostSchema = joi.object().keys({
  body: joi.object().keys({
    vechicle: joi
      .object()
      .keys({
        registration_number: joi.string().min(1).max(16).required(),
      })
      .required(),
  }),
  params: joi.object().optional(),
  query: joi.object().optional(),
});

const vechiclesGetSchema = joi.object().keys({
  body: joi.object().optional(),
  params: joi
    .object()
    .keys({
      id: joi.number().integer().required(),
    })
    .required(),
  query: joi.object().optional(),
});

const vechiclesDeleteSchema = joi.object().keys({
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
  vechiclesPostSchema,
  vechiclesGetSchema,
  vechiclesDeleteSchema,
};
