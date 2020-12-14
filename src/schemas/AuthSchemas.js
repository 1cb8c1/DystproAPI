//IMPORTS
const joi = require("joi");

//SCHEMES
const loginPostSchema = joi.object().keys({
  body: joi
    .object()
    .keys({
      email: joi.string().min(1).max(64).required(),
      password: joi.string().min(1).max(64).required(),
    })
    .required(),
  params: joi.object().optional(),
  query: joi.object().optional(),
});

const registerPostSchema = joi.object().keys({
  body: joi
    .object()
    .keys({
      email: joi.string().min(1).max(64).required(),
      password: joi.string().min(1).max(64).required(),
    })
    .required(),
  params: joi.object().optional(),
  query: joi.object().optional(),
});

//EXPORTS
module.exports = { loginPostSchema, registerPostSchema };
