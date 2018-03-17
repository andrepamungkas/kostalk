'use strict';
module.exports = (sequelize, DataTypes) => {
    var PaymentLog = sequelize.define('PaymentLog', {
        type: DataTypes.STRING,
        request: DataTypes.TEXT,
        response: DataTypes.TEXT
    }, {});
    PaymentLog.associate = function (models) {
        // associations can be defined here
    };
    return PaymentLog;
};