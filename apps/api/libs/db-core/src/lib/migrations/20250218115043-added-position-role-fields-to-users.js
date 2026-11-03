'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'position', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('super_admin', 'admin', 'member'),
      allowNull: false,
    });

    await queryInterface.addColumn('users', 'language', {
      type: Sequelize.ENUM('en', 'es', 'fr'),
      defaultValue: 'en',
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'position');
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.removeColumn('users', 'language');
  }
};
