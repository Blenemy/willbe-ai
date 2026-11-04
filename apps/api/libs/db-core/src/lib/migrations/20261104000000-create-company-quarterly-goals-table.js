'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('company_quarterly_goals', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      company_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      quarter: {
        type: Sequelize.STRING(7),
        allowNull: false,
      },
      goal_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      won_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      pipeline_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'EUR',
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

    await queryInterface.addConstraint('company_quarterly_goals', {
      fields: ['company_id', 'quarter'],
      type: 'unique',
      name: 'company_quarterly_goals_company_id_quarter_key',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('company_quarterly_goals');
  },
};
