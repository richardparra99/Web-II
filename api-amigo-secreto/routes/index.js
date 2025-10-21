module.exports = app => {
    require('./persona.routes')(app);
    require("./search.routes")(app);
    require("./auth.routes")(app);
    require("./sorteo.routes")(app);
    require("./participante.routes")(app);
};