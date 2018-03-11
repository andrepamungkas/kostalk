'use strict';
module.exports = (sequelize, DataTypes) => {
    var Ngekos = sequelize.define('Ngekos', {
        biaya: DataTypes.NUMERIC
    }, {});
    Ngekos.associate = function (models) {
        // associations can be defined here
        Ngekos.hasMany(models.Tagihan, {foreignKey: 'idNgekos'});
    };
    return Ngekos;
};