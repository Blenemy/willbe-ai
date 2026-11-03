'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('saved_accounts', 'is_synced_with_crm', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('saved_leads', 'is_synced_with_crm', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('saved_leads', 'company_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.addColumn('saved_accounts', 'company_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.addColumn('companies', 'auto_sync_crm', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    
    await queryInterface.changeColumn('saved_leads', 'lead_scenario_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.changeColumn('saved_accounts', 'account_scenario_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.addConstraint('saved_leads', {
      fields: ['company_id'],
      type: 'foreign key',
      name: 'saved_leads_company_id_fkey',
      references: {
        table: 'companies',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('saved_accounts', {
      fields: ['company_id'],
      type: 'foreign key',
      name: 'saved_accounts_company_id_fkey',
      references: {
        table: 'companies',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('saved_leads', 'saved_leads_company_id_fkey');
    await queryInterface.removeConstraint('saved_accounts', 'saved_accounts_company_id_fkey');

    await queryInterface.removeColumn('saved_accounts', 'is_synced_with_crm');
    await queryInterface.removeColumn('saved_leads', 'is_synced_with_crm');
    await queryInterface.removeColumn('saved_leads', 'company_id');
    await queryInterface.removeColumn('saved_accounts', 'company_id');
    await queryInterface.changeColumn('saved_leads', 'lead_scenario_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });

    await queryInterface.changeColumn('saved_accounts', 'account_scenario_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },
};
