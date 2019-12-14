"use strict";
const Customer = require("./customer");
module.exports = (sequelize, DataTypes) => {
  const Anomalou = sequelize.define("Anomalou", {
    customerId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    new_tradechannel: DataTypes.STRING,
    due_perd: DataTypes.DATEONLY
  }, {});
  Anomalou.associate = function(models) {
    Anomalou.belongsTo(models.Customer, {
      foreignKey: "customerId",
      onDelete: "CASCADE"
    });
    Anomalou.belongsTo(models.Product, {
      foreignKey: "productId",
      onDelete: "CASCADE"
    });


  };
  return Anomalou;
};
