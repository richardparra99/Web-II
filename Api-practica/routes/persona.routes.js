module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/persona.controller.js");

    router.get("/", controller.getAllPersona);
    router.post("/", controller.insertarPersona);
    router.put("/:id", controller.actualizarPersona);
    router.patch("/:id", controller.actualizarPersonaPatch);
    router.get("/:id", controller.getPersonaPorId);
    router.delete("/:id", controller.eliminarPersona);

    app.use('/personas', router);
}