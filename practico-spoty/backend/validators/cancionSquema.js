const Joi = require("joi");

const cancionSquema = Joi.object({
  nombre:  Joi.string().min(1).max(150).required(),
  albumId: Joi.number().integer().min(1).required(),
  // archivo viene por multer (req.file)
});

const cancionOptionalSquema = Joi.object({
  nombre:  Joi.string().min(1).max(150).optional(),
  albumId: Joi.number().integer().min(1).optional(),
  // archivo por multer
});

module.exports = {
  cancionSquema,
  cancionOptionalSquema,
};
