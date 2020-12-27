//IMPORTS
const joi = require("joi");

//SCHEMAS
const dispatchPostSchema = joi.object().keys({
  body: joi.object().keys({
    dispatch: joi
      .object()
      .keys({
        driver_id: joi.number().integer().required(),
        vehicle_id: joi.number().integer().required(),
        pickup_planned_date: joi.date().optional(),
        reservations_ids: joi
          .array()
          .items(joi.number().integer())
          .min(1)
          .required(),
      })
      .required(),
  }),
  params: joi.object().optional(),
  query: joi.object().optional(),
});

const dispatchDeleteSchema = joi.object().keys({
  body: joi.object().optional(),
  params: joi
    .object()
    .keys({
      id: joi.number().integer().required(),
    })
    .required(),
  query: joi.object().optional(),
});

const dispatchGetSchema = joi.object().keys({
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
  dispatchPostSchema,
  dispatchDeleteSchema,
  dispatchGetSchema,
};
