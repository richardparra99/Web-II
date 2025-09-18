const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Artista = sequelize.define( 
        'Artistas',
        {
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        imagen: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });
    return Artista;
}