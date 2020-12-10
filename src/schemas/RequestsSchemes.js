//IMPORTS
const joi = require("joi");

//SCHEMES
const requestsPostSchema = joi.object().keys({
  body: joi.object().keys({
    info: joi.string().required().min(1).max(512),
  }),
});

//EXPORTS
module.exports = { requestsPostSchema };
