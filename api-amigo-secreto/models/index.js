const { sequelize } = require("../config/db.config");


const persona = require("./persona")(sequelize);
const materia = require("./materia")(sequelize);
const usuario = require("./usuario")(sequelize);
const sorteo = require('./sorteo')(sequelize);
const participante = require('./participante')(sequelize);
const foto = require("./foto")(sequelize);
const authToken = require("./authToken")(sequelize);

persona.hasMany(materia, { foreignKey: "idDocente", as: "materias" });
materia.belongsTo(persona, { foreignKey: "idDocente", as: "docente" });

// relaciones por usuario con las imagenes y albumes
usuario.hasMany(foto, {foreignKey: "userId", as: "fotos"});
foto.belongsTo(usuario, {foreignKey: "userId", as: "user"});

usuario.hasMany(sorteo, {foreignKey: "idUsuario", as: "sorteos"});
sorteo.belongsTo(usuario, { foreignKey: "idUsuario", as: "usuario"});

sorteo.hasMany(participante, {foreignKey: "idSorteo", as: "participantes"});
participante.belongsTo(sorteo, {foreignKey: "idSorteo", as: "sorteo"});

participante.belongsTo(participante, {as: "asignado",foreignKey: "asignadoA"});


// usuario.hasMany(album, {foreignKey: "userId", as: "albumes"});
// album.belongsTo(usuario, {foreignKey: "userId", as: "user"});

// album.hasMany(foto, {foreignKey: "albumId", as: "fotos"});
// foto.belongsTo(album, {foreignKey: "albumId", as: "album"});

// artista.belongsToMany(genero, {through: artistaGenero, as: "generos", foreignKey: "artistaId" });
// genero.belongsToMany(artista, {through: artistaGenero, as: "artistas", foreignKey: "generoId" });

// artista.hasMany(album, {foreignKey: "artistaId", as: "albums"});
// album.belongsTo(artista, {foreignKey: "artistaId", as: "artista"});

// album.hasMany(cancion, { foreignKey: "albumId", as: "canciones" });
// cancion.belongsTo(album, { foreignKey: "albumId", as: "album" });


module.exports = {
    persona,
    materia,
    usuario,
    foto,
    sorteo,
    participante,
    authToken,
    sequelize,
    Sequelize: sequelize.Sequelize
}