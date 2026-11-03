'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('companies', 'short_description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('companies_products_and_services', 'short_description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.changeColumn('companies', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('companies_products_and_services', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('companies', 'short_description');
    await queryInterface.removeColumn('companies_products_and_services', 'short_description');

    await queryInterface.changeColumn('companies', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('companies_products_and_services', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
