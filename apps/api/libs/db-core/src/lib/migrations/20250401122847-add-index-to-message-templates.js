'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex('message_templates', ['language', 'message_structure_id'], {
      unique: true,
      name: 'unique_language_message_structure_id',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('message_templates', 'unique_language_message_structure_id');
  }
};
