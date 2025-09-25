module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/search.controller");

    router.get("/", controller.globalSearch);
    app.use("/search", router);
}