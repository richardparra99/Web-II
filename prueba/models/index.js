const { sequelize } = require("../config/db.config");

const persona = require("./persona")(sequelize);

module.exports = {
    persona,
    sequelize,
}