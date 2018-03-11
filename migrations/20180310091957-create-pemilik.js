'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Pemiliks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nama: {
                allowNull: false,
                type: Sequelize.STRING
            },
            noHp: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true
            },
            saldo: {
                allowNull: false,
                type: Sequelize.NUMERIC,
                defaultValue: 0
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
        return queryInterface.dropTable('Pemiliks');
    }
};