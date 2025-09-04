const { DataTypes } = require("sequelize");


module.exports = function (sequelize) {
    const album = sequelize.define('Album', {
        name: { 
            type: DataTypes.STRING, 
            allowNull: false
        },
        description: { 
            type: DataTypes.STRING 
        },
    });
    return album;
}