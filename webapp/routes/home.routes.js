const { checkUser } = require("../middlewares/check-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/home.controller.js");

    router.get("/", checkUser, controller.getRoot);
    router.get("/prueba", controller.getPrueba);
    router.get("/hola", controller.getHola);
    router.get("/form", controller.getForm);
    router.post("/form-submit", controller.postFormSubmit);
    router.get("/search", checkUser, controller.getMateriaSearch);
    router.get("/login", controller.getLogin);
    router.post("/login", controller.postLogin);
    router.get("/register", controller.getRegister);
    router.post("/register", controller.postRegister);
    router.get("/logout", controller.getLogout);

    app.use('/', router);
};