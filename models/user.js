'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    login: DataTypes.STRING,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    token: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });


  return User;
};
