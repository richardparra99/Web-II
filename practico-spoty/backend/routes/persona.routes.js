const { personaSquema, personaOptionalSquema } = require("../validators/personaSquema.js");
const validateJson = require("../middleware/validation.middleware.js");
const { isJsonRequestValid } = require("../middleware/isJsonRequestValid.middleware.js");
const { getObjectOr404 } = require("../middleware/isObjectOr404.middleware.js");
const db = require('../models');
const validateUser = require("../middleware/validationUser.middleware.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/persona.controller.js");

    router.get("/", validateUser, controller.getAllPersona);
    router.post("/", validateUser ,isJsonRequestValid, validateJson(personaSquema), controller.insertarPersona);
    router.put("/:id", validateUser ,isJsonRequestValid, validateJson(personaSquema), getObjectOr404(db.persona), controller.actualizarPersona);
    router.patch("/:id", validateUser, isJsonRequestValid ,validateJson(personaOptionalSquema), getObjectOr404(db.persona), controller.actualizarPersonaPatch);
    router.get("/:id", validateUser, getObjectOr404(db.persona) ,controller.getPersonaPorId);
    router.delete("/:id", validateUser, getObjectOr404(db.persona), controller.eliminarPersona);

    app.use('/personas', router);
}