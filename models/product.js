"use strict";
// const Customer = require("./customer");
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    customerId: DataTypes.INTEGER,
    srce_sys_id: DataTypes.STRING,
    fact_type_code: DataTypes.STRING,
    sbmsn_type_code: DataTypes.STRING,
    due_perd: DataTypes.DATEONLY,
    time_perd_type_code: DataTypes.STRING,
    time_perd_start_date: DataTypes.DATEONLY,
    prod_id: DataTypes.STRING,
    geo_id: DataTypes.STRING,
    org_id: DataTypes.STRING,
    legal_ent_id: DataTypes.STRING,
    proft_ctr_id: DataTypes.STRING,
    scndr_ship_flag: DataTypes.STRING,
    iso_crncy_code_char: DataTypes.STRING,
    mm_hybrid_id: DataTypes.STRING,
    func_id: DataTypes.STRING,
    captl_id: DataTypes.STRING,
    measr_id: DataTypes.STRING,
    demnd_plan_cust_grp_code: DataTypes.STRING,
    genrc_dmnsn_1_type_id: DataTypes.STRING,
    genrc_dmnsn_1_id: DataTypes.STRING,
    genrc_dmnsn_2_type_id: DataTypes.STRING,
    genrc_dmnsn_2_id: DataTypes.STRING,
    genrc_dmnsn_3_type_id: DataTypes.STRING,
    genrc_dmnsn_3_id: DataTypes.STRING,
    fact_qlty_code: DataTypes.STRING,
    attr_val_1: DataTypes.STRING,
    attr_val_2: DataTypes.STRING,
    gis: DataTypes.STRING,
    marketcode: DataTypes.STRING,
    salesDate: DataTypes.DATEONLY,
    district: DataTypes.STRING,
    city: DataTypes.STRING,
    brandcode: DataTypes.STRING,
    brandname: DataTypes.STRING,
    skucode: DataTypes.STRING,
    skuname: DataTypes.STRING,
    remnant: DataTypes.STRING,
    vanws_qtysu: DataTypes.STRING,
    consumerws_qtysu: DataTypes.STRING,
    retail_qtysu: DataTypes.STRING,
    tradws_localcurrencyvalue: DataTypes.STRING,
    vanws_localcurrencyvalue: DataTypes.STRING,
    consumerws_localcurrencyvalue: DataTypes.STRING,
    fact_amt_1: DataTypes.STRING,
    tradws_qtycases: DataTypes.STRING,
    vanws_qtycases: DataTypes.STRING,
    consumerws_qtycases: DataTypes.STRING,
    fact_amt_2: DataTypes.STRING,
    gross_sar: DataTypes.STRING,
    order_dt: DataTypes.DATEONLY
  }, {});
  Product.associate = function(models) {
    Product.belongsTo(models.Customer, { foreignKey: "customerId" });
    Product.hasMany(models.Anomalou, {
      foreignKey: "productId",
      onDelete: "CASCADE"
    });
    Product.hasMany(models.State_Address, {
      foreignKey: "productId",
      onDelete: "CASCADE"
    });

  };
  return Product;
};
