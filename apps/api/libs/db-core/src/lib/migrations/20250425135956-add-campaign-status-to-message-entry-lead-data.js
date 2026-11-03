'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('message_entries_leads_data', 'status', {
      type: Sequelize.ENUM(
        'in_cadence',
        'response',
        'meeting',
        'bounced',
      ),
      defaultValue: 'in_cadence',
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('message_entries_leads_data', 'status');
  }
};
