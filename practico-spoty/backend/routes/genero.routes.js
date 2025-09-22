const { isJsonRequestValid } = require("../middleware/isJsonRequestValid.middleware");
const { getObjectOr404 } = require("../middleware/isObjectOr404.middleware");
const { generoSquema, generoOptionalSquema } = require("../validators/generoSquema");
const db = require('../models');
const validateJson = require("../middleware/validation.middleware");
const upload = require("../middleware/upload");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/genero.controller");

    router.get("/", controller.getAllGeneros);
    router.post("/", upload.single("imagen"), isJsonRequestValid, validateJson(generoSquema), controller.crearGenero);
    router.put("/:id", upload.single("imagen"), isJsonRequestValid, validateJson(generoSquema), getObjectOr404(db.genero), controller.actualizarGeneroPut);
    router.patch("/:id", upload.single("imagen"), isJsonRequestValid, validateJson(generoOptionalSquema), getObjectOr404(db.genero),controller.actualizarGeneroPatch);
    router.get("/:id", getObjectOr404(db.genero), controller.getGeneroById);
    router.delete("/:id", getObjectOr404(db.genero), controller.eliminarGenero);

    app.use("/generos", router);
}