const { isJsonRequestValid } = require("../middleware/isJsonRequestValid.middleware");
const { getObjectOr404 } = require("../middleware/isObjectOr404.middleware");
const { uploadAudio } = require("../middleware/upload");
const validateJson = require("../middleware/validation.middleware");
const db = require("../models");
const { cancionSquema, cancionOptionalSquema } = require("../validators/cancionSquema");

module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/cancion.controller");

    router.get("/", controller.getAllCanciones);
    router.post("/", uploadAudio.single("archivo"), isJsonRequestValid, validateJson(cancionSquema), controller.crearCancion);
    router.put("/:id", uploadAudio.single("archivo"), isJsonRequestValid, validateJson(cancionSquema), getObjectOr404(db.cancion), controller.actualizarCancionPut);
    router.patch("/:id", uploadAudio.single("archivo"), isJsonRequestValid, validateJson(cancionOptionalSquema), getObjectOr404(db.cancion), controller.actualizarCancionPatch);
    router.get("/:id", getObjectOr404(db.cancion), controller.getCancionById);
    router.delete("/:id", getObjectOr404(db.cancion), controller.eliminarCancion);

    app.use("/canciones", router);
}