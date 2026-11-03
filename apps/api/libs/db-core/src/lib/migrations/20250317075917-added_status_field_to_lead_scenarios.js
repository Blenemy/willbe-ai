'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_scenario_status" AS ENUM ('search', 'select', 'save')
    `);

    await queryInterface.addColumn('lead_scenarios', 'status', {
      type: 'enum_scenario_status',
      allowNull: false,
      defaultValue: 'search',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('lead_scenarios', 'status');
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_scenario_status"
    `);
  }
};
