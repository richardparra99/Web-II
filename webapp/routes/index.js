module.exports = app => {
    require('./home.routes')(app);
    require('./persona.routes')(app);
    require('./materia.routes')(app);
    require('./galeria.routes')(app);
}