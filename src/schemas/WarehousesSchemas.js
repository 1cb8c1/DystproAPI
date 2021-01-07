//IMPORTS
const joi = require("joi");

//SCHEMES
const warehousesPostSchema = joi.object().keys({
  body: joi
    .object()
    .keys({
      warehouse: joi
        .object()
        .keys({
          name: joi.string().min(1).max(32).required(),
          city: joi.string().min(1).max(32).required(),
          street: joi.string().min(1).max(32).required(),
        })
        .required(),
    })
    .required(),
  params: joi.object().optional(),
  query: joi.object().optional(),
});

const warehousesGetSchema = joi.object().keys({
  body: joi.object().optional(),
  params: joi
    .object()
    .keys({
      name: joi.string().min(1).max(32).required(),
    })
    .required(),
  query: joi.object().optional(),
});

const warehousesPatchSchema = joi.object().keys({
  body: joi.object().optional(),
  params: joi
    .object()
    .keys({
      name: joi.string().min(1).max(32).required(),
    })
    .required(),
  query: joi.object().optional(),
});

const warehousesDeleteSchema = joi.object().keys({
  body: joi.object().optional(),
  params: joi
    .object()
    .keys({
      name: joi.string().min(1).max(32).required(),
    })
    .required(),
  query: joi.object().optional(),
});

//EXPORTS
module.exports = {
  warehousesDeleteSchema,
  warehousesPostSchema,
  warehousesGetSchema,
  warehousesPatchSchema,
};
