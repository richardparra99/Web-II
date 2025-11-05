const validateJson = require("../middleware/validation.middleware.js");
const { isJsonRequestValid } = require("../middleware/isJsonRequestValid.middleware.js");
const { getObjectOr404 } = require("../middleware/isObjectOr404.middleware.js");
const db = require('../models');
const validateUser = require("../middleware/validationUser.middleware.js");
const { sorteoSchema, sorteoOptionalSchema } = require("../validators/sorteoSquema.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/sorteo.controller.js");

    router.get("/", validateUser, controller.getAllSorteos);
    router.post("/", validateUser, isJsonRequestValid, validateJson(sorteoSchema), controller.crearSorteos);
    router.put("/:id", validateUser, isJsonRequestValid, validateJson(sorteoSchema), getObjectOr404(db.sorteo), controller.ActualizarSorteos);
    router.patch("/:id", validateUser, isJsonRequestValid, validateJson(sorteoOptionalSchema), getObjectOr404(db.sorteo), controller.actualizarSorteoPatch);
    router.delete("/:id", validateUser, getObjectOr404(db.sorteo), controller.eliminarSorteos);

    router.patch("/:id/sortear", validateUser, getObjectOr404(db.sorteo), controller.sortearSorteo);

    router.get("/:id/resultados", validateUser, controller.getResultadosSorteo);

    router.get("/hash/:hash", controller.getSorteoPorHash);

    app.use('/sorteos', router);
}