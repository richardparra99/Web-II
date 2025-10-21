const Joi = require("joi");

const sorteoSchema = Joi.object({
    nombre: Joi.string().min(3).max(100).required(),
    fecha: Joi.date().required()
});

const sorteoOptionalSchema = Joi.object({
    nombre: Joi.string().min(3).max(100).optional(),
    fecha: Joi.date().optional()
});

module.exports = {
    sorteoSchema,
    sorteoOptionalSchema
};
