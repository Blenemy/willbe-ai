'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_message_language" ADD VALUE 'he';
    `);
  },

  async down (queryInterface, Sequelize) {
    return;
  }
};
