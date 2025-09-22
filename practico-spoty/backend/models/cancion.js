const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Cancion = sequelize.define(
    "Cancion",
    {
      nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      archivo: {
        // URL pública servible: /uploads/<archivo>.mp3
        type: DataTypes.STRING,
        allowNull: true,
      },
      albumId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: "Canciones" }
  );

  return Cancion;
};
