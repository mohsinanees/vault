"use strict";
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define("Customer", {
    customercode: DataTypes.STRING,
    customername: DataTypes.STRING,
    tradechannel: DataTypes.STRING,
    trade_chanl_id: DataTypes.STRING,
    due_perd: DataTypes.DATEONLY,
  }, {});
  Customer.associate = function(models) {
    Customer.hasMany(models.Product, {
      foreignKey: "customerId",
      onDelete: "CASCADE"
    });
    Customer.hasMany(models.Anomalou, {
      foreignKey: "customerId",
      onDelete: "CASCADE"
    });
    Customer.hasMany(models.State_Address, {
      foreignKey: "customerId",
      onDelete: "CASCADE"
    });
  };
  return Customer;
};
