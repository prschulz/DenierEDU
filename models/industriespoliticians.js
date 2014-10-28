"use strict";

module.exports = function(sequelize, DataTypes) {
  var IndustriesPoliticians = sequelize.define("IndustriesPoliticians", {
    PoliticianId: DataTypes.INTEGER,
    IndustryId: DataTypes.INTEGER,
    amount: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        IndustriesPoliticians.belongsTo(models.Politician);
        IndustriesPoliticians.belongsTo(models.Industry);
      }
    }
  });

  return IndustriesPoliticians;
};
