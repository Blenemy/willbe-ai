'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('message_templates', 'subject_type');

    await queryInterface.addColumn('message_structures', 'subject_type', {
      type: 'enum_message_subject_type',
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('message_structures', 'subject_type');

    await queryInterface.addColumn('message_templates', 'subject_type', {
      type: 'enum_message_subject_type',
      allowNull: false,
    });
  }
}; 