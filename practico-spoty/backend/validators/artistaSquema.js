const Joi = require("joi");

const artistaSquema = Joi.object({
    nombre: Joi.string().min(1).max(100).required(),
    imagen: Joi.string().allow("", null).optional()
});

const artistaOptionalSquema = Joi.object({
    nombre: Joi.string().min(1).max(100).optional(),
    imagen: Joi.string().allow("", null).optional()
});

const artistaGeneroSquema = Joi.object({
    generos: Joi.array().items(Joi.number().integer().min(1)).min(1).required(),

});

module.exports = {
    artistaSquema,
    artistaOptionalSquema,
    artistaGeneroSquema
}