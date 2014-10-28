"use strict";

module.exports = function(sequelize, DataTypes) {
  var Industry = sequelize.define("Industry", {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Industry.hasMany(models.Politician);
        Industry.hasMany(models.IndustriesPoliticians,{as:'Contribution'});
      }
    }
  });

  return Industry;
};
