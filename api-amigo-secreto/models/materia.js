const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Materia = sequelize.define(
        'Materia',
        {
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            descripcion: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            creditos: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            idDocente: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
    );
    return Materia;
}