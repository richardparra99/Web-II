const { sequelize } = require("../config/db.config");

const persona = require("./persona")(sequelize);
const materia = require("./materia")(sequelize);
const usuario = require("./usuario")(sequelize);
const album = require("./album")(sequelize);
const foto = require("./foto")(sequelize);

persona.hasMany(materia, { foreignKey: "idDocente", as: "materias" });
materia.belongsTo(persona, { foreignKey: "idDocente", as: "docente" });

// relaciones por usuario con las imagenes y albumes
usuario.hasMany(foto, {foreignKey: "userId", as: "fotos"});
foto.belongsTo(usuario, {foreignKey: "userId", as: "user"});

usuario.hasMany(album, {foreignKey: "userId", as: "albumes"});
album.belongsTo(usuario, {foreignKey: "userId", as: "user"});

album.hasMany(foto, {foreignKey: "albumId", as: "fotos"});
foto.belongsTo(album, {foreignKey: "albumId", as: "album"});


module.exports = {
    persona,
    materia,
    usuario,
    foto,
    album,
    sequelize,
    Sequelize: sequelize.Sequelize
}