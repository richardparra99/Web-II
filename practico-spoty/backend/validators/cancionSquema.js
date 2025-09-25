const Joi = require("joi");

const cancionSquema = Joi.object({
  nombre:  Joi.string().min(1).max(150).required(),
  albumId: Joi.number().integer().min(1).required(), // ← solo si NO hay 'sencillo'
});

const cancionOptionalSquema = Joi.object({
  nombre:  Joi.string().min(1).max(150).optional(),
  albumId: Joi.number().integer().min(1).optional(),
});

const cancionCreateSchema = Joi.object({
  nombre:   Joi.string().min(1).max(150).required(),
  albumId:  Joi.number().integer().min(1).optional().allow(null, ""),
  sencillo: Joi.boolean().truthy("true").truthy("1").falsy("false").falsy("0").optional(),
});

module.exports = {
  cancionSquema,
  cancionOptionalSquema,
  cancionCreateSchema,
};
