'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Tagihans', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            jumlah: {
                allowNull: false,
                type: Sequelize.NUMERIC,
                defaultValue: 0
            },
            mulai: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            akhir: {
                allowNull: false,
                type: Sequelize.DATE
            },
            noVa: {
                type: Sequelize.INTEGER
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: 'pending'
            },
            idNgekos: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Ngekos',
                    key: 'id'
                }
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
        return queryInterface.dropTable('Tagihans');
    }
};