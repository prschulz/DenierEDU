"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Politicians", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      firstname: {
        type: DataTypes.STRING
      },
      lastname: {
        type: DataTypes.STRING
      },
      quote: {
        type: DataTypes.TEXT
      },
      quote_source: {
        type: DataTypes.STRING
      },
      chamber: {
        type: DataTypes.STRING
      },
      party: {
        type: DataTypes.STRING
      },
      state: {
        type: DataTypes.STRING
      },
      district: {
        type: DataTypes.STRING
      },
      title: {
        type: DataTypes.STRING
      },
      crp_id: {
        type: DataTypes.STRING
      },
      bioguide_id: {
        type: DataTypes.STRING
      },
      website: {
        type: DataTypes.STRING
      },
      contact_form: {
        type: DataTypes.STRING
      },
      twitter_id: {
        type: DataTypes.STRING
      },
      facebook_id: {
        type: DataTypes.STRING
      },
      picture: {
        type: DataTypes.STRING
      },
      oc_email: {
        type: DataTypes.STRING
      },
      industry1_name: {
        type: DataTypes.STRING,
      },
      industry1_total: {
        type: DataTypes.STRING,
      },
      industry2_name: {
        type: DataTypes.STRING,
      },
      industry2_total: {
        type: DataTypes.STRING,
      },
      industry3_name: {
        type: DataTypes.STRING,
      },
      industry3_total: {
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Politicians").done(done);
  }
};