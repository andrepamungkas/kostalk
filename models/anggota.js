'use strict';
module.exports = (sequelize, DataTypes) => {
    var Anggota = sequelize.define('Anggota', {
        nama: DataTypes.STRING,
        noHp: DataTypes.STRING,
        email: DataTypes.STRING,
        status: DataTypes.BOOLEAN
    }, {});
    Anggota.associate = function (models) {
        // associations can be defined here
        Anggota.belongsToMany(models.Pemilik, {
            through: models.Ngekos,
            foreignKey: 'idAnggota',
            otherKey: 'idPemilik'
        });
    };
    return Anggota;
};