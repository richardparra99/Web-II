const validateJson = require("../middleware/validation.middleware.js");
const { isJsonRequestValid } = require("../middleware/isJsonRequestValid.middleware.js");
const { getObjectOr404 } = require("../middleware/isObjectOr404.middleware.js");
const db = require('../models');
const validateUser = require("../middleware/validationUser.middleware.js");
const { participanteSchema, wishlistSchema } = require("../validators/participanteSquema.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/participante.controller.js");

    router.post("/", validateUser, isJsonRequestValid, validateJson(participanteSchema), controller.crearParticipante);
    router.get("/sorteo/:idSorteo", validateUser, controller.getParticipantesPorSorteo);
    router.get("/:hash", controller.getParticipantePorHash);
    router.patch("/:hash/wishlist", isJsonRequestValid, validateJson(wishlistSchema), controller.actualizarWishlist);
    router.delete("/:id", validateUser, controller.eliminarParticipante);

    app.use('/participantes', router);
}