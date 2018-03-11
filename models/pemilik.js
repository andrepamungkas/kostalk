'use strict';
module.exports = (sequelize, DataTypes) => {
    var Pemilik = sequelize.define('Pemilik', {
        nama: DataTypes.STRING,
        noHp: DataTypes.STRING,
        email: DataTypes.STRING,
        saldo: DataTypes.NUMERIC
    }, {});
    Pemilik.associate = function (models) {
        // associations can be defined here
        Pemilik.belongsToMany(models.Anggota, {
            through: models.Ngekos,
            foreignKey: 'idPemilik',
            otherKey: 'idAnggota'
        });
    };
    return Pemilik;
};