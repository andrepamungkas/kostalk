'use strict';
module.exports = (sequelize, DataTypes) => {
    var Activation = sequelize.define('Activation', {
        token: DataTypes.STRING,
        ttl: DataTypes.INTEGER
    }, {});
    Activation.associate = function (models) {
        // associations can be defined here
    };
    return Activation;
};