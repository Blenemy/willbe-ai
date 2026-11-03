'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('sent_email_messages', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      email_message_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message_entry_lead_data_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'message_entries_leads_data',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
      status: {
        type: Sequelize.ENUM('sent', 'responded', 'bounced', 'not_answered'),
        allowNull: false,
      },
      sent_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      responded_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('sent_gmail_messages');
  }
};
