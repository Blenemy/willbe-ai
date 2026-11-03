'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('message_entries', 'send_date', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('message_entries', 'send_date_utc', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('message_entries', 'send_date_utc');

    await queryInterface.changeColumn('message_entries', 'send_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
};
