'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_message_type" AS ENUM (
        'first_email',
        'follow_up_email',
        'linkedin_connection',
        'linkedin_message',
        'linkedin_follow_up'
      )
    `);

    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_message_subject_type" AS ENUM (
        'account_company',
        'account_company_text',
        'text'
      )
    `);

    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_message_language" AS ENUM ('es', 'en', 'fr', 'pt', 'de', 'it')
    `);

    await queryInterface.createTable('message_structures', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message_type: {
        type: 'enum_message_type',
        allowNull: false,
      },
      words_limit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable('message_templates', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      subject_type: {
        type: 'enum_message_subject_type',
        allowNull: false,
      },
      objective: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      subject: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      greeting: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      introduction: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('message_structures');
    await queryInterface.dropTable('message_templates');

    await queryInterface.sequelize.query(`
      DROP TYPE "enum_message_type"
    `);
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_message_subject_type"
    `);
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_message_language"
    `);
  }
};
