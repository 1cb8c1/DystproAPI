//IMPORTS
const joi = require("joi");

//SCHEMES
const productsGetSchema = joi.object().keys({
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
module.exports = { productsGetSchema };
