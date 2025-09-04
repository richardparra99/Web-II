const { checkUser } = require("../middlewares/check-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/materia.controller.js");

    router.get("/", checkUser, controller.getMateriaList);
    router.get("/create", checkUser, controller.getMateriaCreate);
    router.post("/create", checkUser, controller.postMateriaCreate);
    router.get("/:id", checkUser, controller.getMateriaById);
    router.post("/:id", checkUser, controller.postMateriaUpdate);
    router.post("/:id/delete", checkUser, controller.postMateriaDelete);

    app.use('/materias', router);
};