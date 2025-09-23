const { isJsonRequestValid } = require("../middleware/isJsonRequestValid.middleware");
const { getObjectOr404 } = require("../middleware/isObjectOr404.middleware");
const { uploadImage } = require("../middleware/upload");
const validateJson = require("../middleware/validation.middleware");
const db = require("../models");
const { albumSquema, albumOptionalSquema } = require("../validators/albumSquema");

module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/album.controller");

    router.get("/", controller.getAllAlbums);
    router.post("/", uploadImage.single("imagen"), isJsonRequestValid, validateJson(albumSquema), controller.crearAlbum);
    router.put("/:id", uploadImage.single("imagen"), isJsonRequestValid, validateJson(albumSquema), getObjectOr404(db.album), controller.actualizarAlbumPut);
    router.patch("/:id", uploadImage.single("imagen"), isJsonRequestValid, validateJson(albumOptionalSquema), getObjectOr404(db.album), controller.actualizarAlbumPatch);
    router.get("/:id", getObjectOr404(db.album), controller.getAlbumById);
    router.delete("/:id", getObjectOr404(db.album), controller.eliminarAlbum);

    app.use("/albums", router);
}