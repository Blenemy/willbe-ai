'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('message_templates', 'language', {
      type: 'enum_message_language',
      allowNull: false,
    });

    await queryInterface.addColumn('message_templates', 'message_structure_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'message_structures',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('message_templates', 'language');
    await queryInterface.removeColumn('message_templates', 'message_structure_id');
  }
};
