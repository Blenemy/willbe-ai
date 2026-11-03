'use strict';

const fs = require('fs');
const path = require('path');

const USER_ID = '9b3e4c7a-5d0f-4e3b-9c4a-0f6d7e8a9b03';
const SIGNATURE_ID = 'e1a2b3c4-5555-4a1b-8c1d-000000000010';

const INSERTS_PATH = path.join(__dirname, 'data', 'demo-pipeline.sql');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    await queryInterface.sequelize.query(`
      DELETE FROM received_messages
       WHERE sent_email_message_id IN (
         SELECT id FROM sent_email_messages
         WHERE message_scenario_id IN (SELECT id FROM message_scenarios WHERE user_id = :userId)
       );
      DELETE FROM sent_email_messages
       WHERE message_scenario_id IN (SELECT id FROM message_scenarios WHERE user_id = :userId);
      DELETE FROM message_entries_leads_data
       WHERE message_entry_id IN (
         SELECT id FROM message_entries
         WHERE message_scenario_id IN (SELECT id FROM message_scenarios WHERE user_id = :userId)
       );
      DELETE FROM message_entries
       WHERE message_scenario_id IN (SELECT id FROM message_scenarios WHERE user_id = :userId);
      DELETE FROM message_scenarios_leads
       WHERE message_scenario_id IN (SELECT id FROM message_scenarios WHERE user_id = :userId);
      DELETE FROM message_scenarios WHERE user_id = :userId;
      DELETE FROM saved_leads WHERE company_id IN (SELECT company_id FROM users WHERE id = :userId);
      DELETE FROM saved_accounts WHERE user_id = :userId;
      DELETE FROM lead_scenarios WHERE user_id = :userId;
      DELETE FROM lead_scenarios_filters_values
       WHERE filter_id IN (SELECT id FROM lead_scenarios_filters WHERE user_id = :userId);
      DELETE FROM lead_scenarios_filters WHERE user_id = :userId;
      DELETE FROM account_scenarios_filters_values
       WHERE account_scenario_id IN (SELECT id FROM account_scenarios WHERE user_id = :userId);
      DELETE FROM account_scenarios WHERE user_id = :userId;
      DELETE FROM users_email_signatures WHERE user_id = :userId;
    `, { replacements: { userId: USER_ID } });

    const sql = fs.readFileSync(INSERTS_PATH, 'utf8');
    await queryInterface.sequelize.query(sql);

    await queryInterface.bulkInsert('users_email_signatures', [
      {
        id: SIGNATURE_ID,
        user_id: USER_ID,
        body:
          'Demo User<br>Head of Sales, Willbe Demo<br>' +
          '<a href="https://willbe.dev">willbe.dev</a>',
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      DELETE FROM received_messages
       WHERE sent_email_message_id IN (
         SELECT id FROM sent_email_messages
         WHERE message_scenario_id IN (SELECT id FROM message_scenarios WHERE user_id = :userId)
       );
      DELETE FROM sent_email_messages
       WHERE message_scenario_id IN (SELECT id FROM message_scenarios WHERE user_id = :userId);
      DELETE FROM message_entries_leads_data
       WHERE message_entry_id IN (
         SELECT id FROM message_entries
         WHERE message_scenario_id IN (SELECT id FROM message_scenarios WHERE user_id = :userId)
       );
      DELETE FROM message_entries
       WHERE message_scenario_id IN (SELECT id FROM message_scenarios WHERE user_id = :userId);
      DELETE FROM message_scenarios_leads
       WHERE message_scenario_id IN (SELECT id FROM message_scenarios WHERE user_id = :userId);
      DELETE FROM message_scenarios WHERE user_id = :userId;
      DELETE FROM saved_leads WHERE company_id IN (SELECT company_id FROM users WHERE id = :userId);
      DELETE FROM saved_accounts WHERE user_id = :userId;
      DELETE FROM lead_scenarios WHERE user_id = :userId;
      DELETE FROM lead_scenarios_filters_values
       WHERE filter_id IN (SELECT id FROM lead_scenarios_filters WHERE user_id = :userId);
      DELETE FROM lead_scenarios_filters WHERE user_id = :userId;
      DELETE FROM account_scenarios_filters_values
       WHERE account_scenario_id IN (SELECT id FROM account_scenarios WHERE user_id = :userId);
      DELETE FROM account_scenarios WHERE user_id = :userId;
      DELETE FROM users_email_signatures WHERE user_id = :userId;
    `, { replacements: { userId: USER_ID } });
  },
};
