'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('leads_search_results', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      cursor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lead_scenario_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'lead_scenarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('leads_search_results');
  }
};
