module.exports = app => {
    require('./persona.routes')(app);
    require('./genero.routes')(app);
    require('./artista.routes')(app);
};