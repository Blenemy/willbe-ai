'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('saved_accounts', 'hubspot_company_id', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('saved_leads', 'hubspot_contact_id', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('saved_leads', 'account_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'saved_accounts',
        key: 'id',
        onDelete: 'CASCADE',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('saved_accounts', 'hubspot_company_id');
    await queryInterface.removeColumn('saved_leads', 'hubspot_contact_id');
    await queryInterface.removeColumn('saved_leads', 'account_id');
  }
};
