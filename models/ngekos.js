'use strict';
module.exports = (sequelize, DataTypes) => {
    var Ngekos = sequelize.define('Ngekos', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        biaya: DataTypes.NUMERIC,
        interval: DataTypes.INTEGER
    }, {});
    Ngekos.associate = function (models) {
        // associations can be defined here
        Ngekos.hasMany(models.Tagihan, {foreignKey: 'idNgekos'});
        Ngekos.hasOne(models.Activation, {foreignKey: 'idNgekos'});
    };
    return Ngekos;
};