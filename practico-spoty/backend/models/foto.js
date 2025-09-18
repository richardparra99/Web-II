const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const foto = sequelize.define('Foto', {
        filename: {
            type: DataTypes.STRING,
            allowNull: false
        },
        OriginalName: {
            type: DataTypes.STRING
        },
        mimeType: {
            type: DataTypes.STRING
        },
        tamano: {
            type: DataTypes.STRING
        },
        titulo: {
            type: DataTypes.STRING
        },
    });
    return foto;
};