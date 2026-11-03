'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('crm_fields_bindings', 'crm_account_not_contacted_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('crm_fields_bindings', 'crm_account_in_cadence_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('crm_fields_bindings', 'crm_account_response_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('crm_fields_bindings', 'crm_account_meeting_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('crm_fields_bindings', 'crm_account_bounced_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('crm_fields_bindings', 'crm_account_out_of_office_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('crm_fields_bindings', 'crm_account_unresponsive_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('crm_fields_bindings', 'crm_lead_not_contacted_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('crm_fields_bindings', 'crm_lead_in_cadence_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('crm_fields_bindings', 'crm_lead_response_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('crm_fields_bindings', 'crm_lead_meeting_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('crm_fields_bindings', 'crm_lead_bounced_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('crm_fields_bindings', 'crm_lead_out_of_office_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('crm_fields_bindings', 'crm_lead_unresponsive_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('crm_fields_bindings', 'crm_account_not_contacted_status');
    await queryInterface.removeColumn('crm_fields_bindings', 'crm_account_in_cadence_status');
    await queryInterface.removeColumn('crm_fields_bindings', 'crm_account_response_status');
    await queryInterface.removeColumn('crm_fields_bindings', 'crm_account_meeting_status');
    await queryInterface.removeColumn('crm_fields_bindings', 'crm_account_bounced_status');
    await queryInterface.removeColumn('crm_fields_bindings', 'crm_account_out_of_office_status');
    await queryInterface.removeColumn('crm_fields_bindings', 'crm_account_unresponsive_status');
    await queryInterface.removeColumn('crm_fields_bindings', 'crm_lead_not_contacted_status');
    await queryInterface.removeColumn('crm_fields_bindings', 'crm_lead_in_cadence_status');
    await queryInterface.removeColumn('crm_fields_bindings', 'crm_lead_response_status');
    await queryInterface.removeColumn('crm_fields_bindings', 'crm_lead_meeting_status');
    await queryInterface.removeColumn('crm_fields_bindings', 'crm_lead_bounced_status');
    await queryInterface.removeColumn('crm_fields_bindings', 'crm_lead_out_of_office_status');
    await queryInterface.removeColumn('crm_fields_bindings', 'crm_lead_unresponsive_status');
  }
};
