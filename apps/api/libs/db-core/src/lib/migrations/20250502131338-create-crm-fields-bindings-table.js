'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('crm_fields_bindings', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      company_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id',
        },
      },
      crm_lead_first_name_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_lead_last_name_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_lead_company_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_lead_job_title_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_lead_industry_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_lead_position_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_lead_position_description_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_lead_email_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_lead_phone_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_lead_language_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_lead_location_country_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_lead_location_city_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_lead_subtitle_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_lead_summary_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_lead_linked_in_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_account_name_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_account_city_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_account_website_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_account_company_title_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_account_founded_in_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_account_headquarters_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_account_employees_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_account_industry_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_account_linked_in_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm_account_description_field: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('crm_fields_bindings');
  }
};
