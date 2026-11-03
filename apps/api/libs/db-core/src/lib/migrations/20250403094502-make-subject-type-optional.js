'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('message_structures', 'subject_type', {
      type: 'enum_message_subject_type',
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('message_structures', 'subject_type', {
      type: 'enum_message_subject_type',
      allowNull: false,
    });
  }
};
