const Joi = require("joi");

const participanteSchema = Joi.object({
    nombre: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().optional(),
    idSorteo: Joi.number().required()
});

const wishlistSchema = Joi.object({
    wishlist: Joi.string().min(1).max(1000).required()
});

module.exports = {
    participanteSchema,
    wishlistSchema
};
