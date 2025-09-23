const { isJsonRequestValid } = require("../middleware/isJsonRequestValid.middleware");
const { getObjectOr404 } = require("../middleware/isObjectOr404.middleware");
const { uploadImage } = require("../middleware/upload");
const validateJson = require("../middleware/validation.middleware");
const db = require("../models");
const { artistaSquema, artistaOptionalSquema, artistaGeneroSquema } = require("../validators/artistaSquema");

module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/artista.controller");

    router.get("/",  controller.getAllArtistas);
    router.post("/", uploadImage.single("imagen"), isJsonRequestValid, validateJson(artistaSquema),controller.crearArtistas);
    router.put("/:id", uploadImage.single("imagen"), isJsonRequestValid, validateJson(artistaSquema), getObjectOr404(db.artista), controller.actulizarArtistaPut);
    router.patch("/:id", uploadImage.single("imagen"), isJsonRequestValid, validateJson(artistaOptionalSquema), getObjectOr404(db.artista), controller.actualizarArtistaPatch);
    router.get("/:id", getObjectOr404(db.artista), controller.getArtistasById);
    router.delete("/:id", getObjectOr404(db.artista), controller.eliminarArtista);

    router.get("/:id/generos", controller.getGenerosDeArtista);
    router.post("/:id/generos",getObjectOr404(db.artista), isJsonRequestValid, validateJson(artistaGeneroSquema), controller.setGeneros);
    router.post("/:id/generos/:generoId", getObjectOr404(db.artista), controller.addGeneros);
    router.delete("/:id/generos/generoId", getObjectOr404(db.artista), controller.removeGenero);

    app.use("/artistas", router);
}