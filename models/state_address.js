'use strict';
module.exports = (sequelize, DataTypes) => {
  const State_Address = sequelize.define('State_Address', {
    customerId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    state_address: DataTypes.STRING
  }, {});
  State_Address.associate = function(models) {
    State_Address.belongsTo(models.Customer, {
      foreignKey: "customerId",
      onDelete: "CASCADE"
    });
    State_Address.belongsTo(models.Product, {
      foreignKey: "customerId",
      onDelete: "CASCADE"
    });
  };
  return State_Address;
};
