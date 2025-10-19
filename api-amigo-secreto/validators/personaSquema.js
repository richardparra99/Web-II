const Joi = require('joi');

const personaSquema = Joi.object({
    nombre:Joi.string().min(1).max(100).required(),
    apellido: Joi.string().min(1).max(100).required(),
    edad: Joi.number().min(0).required(),
    ciudad: Joi.string().min(1).max(100).optional(),
    fechaNacimiento: Joi.date().optional()
});

const personaOptionalSquema = Joi.object({
    nombre:Joi.string().min(1).max(100).optional(),
    apellido: Joi.string().min(1).max(100).optional(),
    edad: Joi.number().min(0).optional(),
    ciudad: Joi.string().min(1).max(100).optional(),
    fechaNacimiento: Joi.date().optional()
})

module.exports = {
    personaSquema,
    personaOptionalSquema
};