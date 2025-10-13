const Joi = require('joi');
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    nombreCompleto: Joi.string().min(1).max(100).required()
});

module.exports = {
    loginSchema,
    registerSchema
};