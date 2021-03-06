'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Anggota', {
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
                type: Sequelize.STRING,
                unique: true
            },
            status: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
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
        return queryInterface.dropTable('Anggota');
    }
};