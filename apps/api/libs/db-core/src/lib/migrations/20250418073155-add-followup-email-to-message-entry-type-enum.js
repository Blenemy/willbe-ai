'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_message_entry_type" ADD VALUE 'follow_up_email';
    `);
  },

  async down (queryInterface, Sequelize) {
    return;
  }
};
