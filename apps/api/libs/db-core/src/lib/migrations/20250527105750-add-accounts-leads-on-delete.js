'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('saved_leads', 'saved_leads_account_id_fkey');

    await queryInterface.addConstraint('saved_leads', {
      fields: ['account_id'],
      type: 'foreign key',
      name: 'saved_leads_account_id_fkey',
      references: {
        table: 'saved_accounts',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('saved_leads', 'saved_leads_account_id_fkey');

    await queryInterface.addConstraint('saved_leads', {
      fields: ['account_id'],
      type: 'foreign key',
      name: 'saved_leads_account_id_fkey',
      references: {
        table: 'saved_accounts',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  }
};
