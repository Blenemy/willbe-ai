'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE enum_sent_email_messages_status ADD VALUE 'out_of_office';
    `);
  },

  async down (queryInterface, Sequelize) {}
};
