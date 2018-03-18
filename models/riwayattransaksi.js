'use strict';
module.exports = (sequelize, DataTypes) => {
    let RiwayatTransaksi = sequelize.define('RiwayatTransaksi', {
        aliran: DataTypes.STRING,
        jumlah: DataTypes.NUMERIC,
        keterangan: DataTypes.STRING,
        idAnggota: DataTypes.INTEGER
    }, {});
    RiwayatTransaksi.associate = function (models) {
        // associations can be defined here
        RiwayatTransaksi.belongsTo(models.Pemilik, {foreignKey: 'idPemilik'});
    };
    return RiwayatTransaksi;
};