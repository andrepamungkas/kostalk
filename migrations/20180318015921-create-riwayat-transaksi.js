'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('RiwayatTransaksis', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            aliran: {
                type: Sequelize.STRING
            },
            jumlah: {
                type: Sequelize.NUMERIC
            },
            keterangan: {
                type: Sequelize.STRING
            },
            idAnggota: {
                type: Sequelize.INTEGER
            },
            idPemilik: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Pemiliks',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'set null'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('RiwayatTransaksis');
    }
};