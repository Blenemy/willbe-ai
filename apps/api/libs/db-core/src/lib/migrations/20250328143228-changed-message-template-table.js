'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('message_templates', 'body');

    await queryInterface.addColumn('message_templates', 'paragraphs', {
      type: Sequelize.ARRAY(Sequelize.JSONB),
      allowNull: true,
    });

    await queryInterface.addColumn('message_templates', 'goodbye', {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    await queryInterface.addColumn('message_templates', 'sample_message', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE message_templates 
      ALTER COLUMN introduction TYPE JSONB 
      USING introduction::jsonb;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE message_templates 
      ALTER COLUMN introduction TYPE TEXT 
      USING introduction::text;
    `);

    await queryInterface.removeColumn('message_templates', 'paragraphs');
    await queryInterface.removeColumn('message_templates', 'goodbye');
    await queryInterface.removeColumn('message_templates', 'sample_message');

    await queryInterface.addColumn('message_templates', 'body', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
};
