const Joi = require("joi");

const albumSquema = Joi.object({
  nombre: Joi.string().min(1).max(100).required(),
  artistaId: Joi.number().integer().min(1).required(),
  // imagen no se valida aquí porque llega por multer (req.file)
});

const albumOptionalSquema = Joi.object({
  nombre: Joi.string().min(1).max(100).optional(),
  artistaId: Joi.number().integer().min(1).optional(),
  // imagen por multer
});

module.exports = {
  albumSquema,
  albumOptionalSquema,
};