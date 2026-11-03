'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_message_entry_type" AS ENUM (
        'first_email',
        'linkedin_connection',
        'linkedin_message'
      )
    `);

    await queryInterface.createTable('message_entries', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      message_scenario_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'message_scenarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      type: {
        type: 'enum_message_entry_type',
        allowNull: true,
      },
      send_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      send_now: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable('message_entries_leads_data', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      message_entry_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'message_entries',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      lead_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      language: {
        type: 'enum_message_language',
        allowNull: true,
      },
      message_structure_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      product_service_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('message_entries_leads_data');
    await queryInterface.dropTable('message_entries');
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_message_entry_type";
    `);
  },
};
