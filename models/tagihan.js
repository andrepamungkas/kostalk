'use strict';
module.exports = (sequelize, DataTypes) => {
    var Tagihan = sequelize.define('Tagihan', {
        jumlah: DataTypes.NUMERIC,
        mulai: DataTypes.DATE,
        akhir: DataTypes.DATE,
        noVa: DataTypes.INTEGER,
        status: DataTypes.STRING
    }, {});
    Tagihan.associate = function (models) {
        // associations can be defined here
        Tagihan.belongsTo(models.Ngekos, {foreignKey: 'idNgekos'});
    };
    return Tagihan;
};