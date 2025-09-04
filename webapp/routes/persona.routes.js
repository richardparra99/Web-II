const { checkUser } = require("../middlewares/check-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/persona.controller.js");

    router.get("/", checkUser, controller.getPersonaList);
    router.get("/create", checkUser, controller.getPersonaInsert);
    router.post("/create", checkUser, controller.postPersonaInsert);
    router.get("/:id", checkUser, controller.getPersonaUpdate);
    router.post("/:id", checkUser, controller.postPersonaUpdate);
    router.post("/:id/delete", checkUser, controller.postPersonaDelete);

    app.use('/personas', router);
};