"use strict";

module.exports = function(sequelize, DataTypes) {
  var Politician = sequelize.define("Politician", {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    quote: DataTypes.TEXT,
    quote_source: DataTypes.STRING,
    chamber: DataTypes.STRING,
    party: DataTypes.STRING,
    state: DataTypes.STRING,
    district: DataTypes.STRING,
    title: DataTypes.STRING,
    crp_id: DataTypes.STRING,
    bioguide_id: DataTypes.STRING,
    website: DataTypes.STRING,
    contact_form: DataTypes.STRING,
    twitter_id: DataTypes.STRING,
    facebook_id: DataTypes.STRING,
    picture: DataTypes.STRING,
    oc_email: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Politician.hasMany(models.Industry);
        Politician.hasMany(models.IndustriesPoliticians, {as:'Contribution'});
      }
    }
  });

  return Politician;
};
