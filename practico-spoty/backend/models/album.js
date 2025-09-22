const { DataTypes } = require("sequelize");


module.exports = function (sequelize) {
  const Album = sequelize.define(
    "Album",
    {
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      imagen: {
        type: DataTypes.STRING, // ruta a /uploads/...
        allowNull: true,
      },
      // FK → Artista
      artistaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Albums",
    }
  );

  return Album;
};