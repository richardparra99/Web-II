const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Genero = sequelize.define(
        'Genero',
        {
            nombre: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            imagen: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        }
    );
    return Genero;
};