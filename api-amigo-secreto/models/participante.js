const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Participante = sequelize.define("Participante", {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    wishlist: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hashAcceso: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    identificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    asignadoA: {
      type: DataTypes.INTEGER, // id del participante al que le toca dar el regalo
      allowNull: true
    },
    idSorteo: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  return Participante;
};
