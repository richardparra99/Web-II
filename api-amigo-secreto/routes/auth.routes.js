const validateJson = require("../middleware/validation.middleware.js");
const { isJsonRequestValid } = require("../middleware/isJsonRequestValid.middleware.js");
const { loginSchema, registerSchema } = require("../validators/authSquema.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/auth.controller.js");

    router.post("/login", isJsonRequestValid, validateJson(loginSchema), controller.login);
    router.post("/register", isJsonRequestValid, validateJson(registerSchema), controller.register);

    app.use('/auth', router);
};