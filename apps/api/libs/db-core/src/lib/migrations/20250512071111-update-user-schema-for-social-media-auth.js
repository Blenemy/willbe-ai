'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_users_auth_provider" AS ENUM ('google', 'linkedin', 'microsoft')
    `);

    await queryInterface.addColumn('users', 'auth_provider', {
      type: 'enum_users_auth_provider',
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'auth_provider');

    await queryInterface.sequelize.query(`
      DROP TYPE "enum_users_auth_provider"
    `);

    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
