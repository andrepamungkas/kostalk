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
                type: Sequelize.NUMERIC
            },
            mulai: {
                type: Sequelize.DATE
            },
            akhir: {
                type: Sequelize.DATE
            },
            noVa: {
                type: Sequelize.INTEGER
            },
            status: {
                type: Sequelize.STRING
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