//IMPORTS
const joi = require("joi");

//SCHEMES
const reservationPostSchema = joi.object().keys({
  body: joi.object().keys({
    reservation: joi
      .object()
      .keys({
        product_warehouse_id: joi.number().integer().required(),
        amount: joi.number().integer().required(),
      })
      .required(),
  }),
  params: joi.object().optional(),
  query: joi.object().optional(),
});

const reservationDeleteSchema = joi.object().keys({
  body: joi.object().optional(),
  params: joi
    .object()
    .keys({
      id: joi.number().integer().required(),
    })
    .required(),
  query: joi.object().optional(),
});

const reservationGetSchema = joi.object().keys({
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
  reservationPostSchema,
  reservationDeleteSchema,
  reservationGetSchema,
};
