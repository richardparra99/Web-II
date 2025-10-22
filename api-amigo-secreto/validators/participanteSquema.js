const Joi = require("joi");

const participanteSchema = Joi.object({
    nombre: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    idSorteo: Joi.number().integer().required(),
    wishlist: Joi.string().allow("").optional(),
}).unknown(true);

const wishlistSchema = Joi.object({
    wishlist: Joi.string().min(1).max(1000).required(),
});

module.exports = {
    participanteSchema,
    wishlistSchema,
};
