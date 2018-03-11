'use strict';
module.exports = (sequelize, DataTypes) => {
    var Otp = sequelize.define('Otp', {
        kunci: DataTypes.STRING,
        kode: DataTypes.STRING,
        ttl: DataTypes.INTEGER
    }, {});
    Otp.associate = function (models) {
        // associations can be defined here
    };
    return Otp;
};