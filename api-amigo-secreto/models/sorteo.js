const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Sorteo = sequelize.define("Sorteo", {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    hashAcceso: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    iniciado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  return Sorteo;
};
