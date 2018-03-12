'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Ngekos', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            biaya: {
                allowNull: false,
                type: Sequelize.NUMERIC,
                defaultValue: 0
            },
            interval: {
                allowNull: false,
                type: Sequelize.INTEGER,
                defaultValue: 1
            },
            idPemilik: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Pemiliks',
                    key: 'id'
                }
            },
            idAnggota: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Anggota',
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
        }).then(function () {
            return queryInterface.addConstraint('Ngekos', ['idPemilik', 'idAnggota'], {
                type: 'unique'
            });
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Ngekos');
    }
};