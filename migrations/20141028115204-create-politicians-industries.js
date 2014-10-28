"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("IndustriesPoliticians", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      PoliticianId: {
        type: DataTypes.INTEGER,
        references: "Politicians",
        referencesKey: "id"
      },
      IndustryId: {
        type: DataTypes.INTEGER,
        references: "Industries",
        referencesKey: "id"
      },
      amount: {
        type: DataTypes.STRING
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
    migration.dropTable("IndustriesPoliticians").done(done);
  }
};