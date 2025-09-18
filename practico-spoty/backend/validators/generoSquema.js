const Joi = require("joi");

const generoSquema = Joi.object({
    nombre: Joi.string().min(1).max(100).required(),
    imagen: Joi.string().uri().optional()
});

const generoOptionalSquema = Joi.object({
    nombre: Joi.string().min(1).max(100).optional(),
    imagen: Joi.string().uri().optional()
});

module.exports = {
    generoSquema,
    generoOptionalSquema
};