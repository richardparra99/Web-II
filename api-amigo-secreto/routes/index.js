module.exports = app => {
    require('./persona.routes')(app);
    require("./search.routes")(app);
    require("./auth.routes")(app);
};