module.exports = app => {
    require('./persona.routes')(app);
    require('./genero.routes')(app);
    require('./artista.routes')(app);
    require('./album.routes')(app);
    require('./cancion.routes')(app);
    require("./search.routes")(app);
    require("./auth.routes")(app);
};