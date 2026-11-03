'use strict';

const COMPANY_ID = '6f1c2a5e-3b8d-4c1f-9a2e-7d4b5c6e8f01';
const PRODUCT_ID = '8a2d3b6f-4c9e-4d2a-8b3f-9e5c6d7f8a02';
const USER_ID = '9b3e4c7a-5d0f-4e3b-9c4a-0f6d7e8a9b03';
const LINKEDIN_ACCOUNT_ID = 'ac4f5d8b-6e1a-4f4c-8d5b-1a7e8f9b0c04';

const DEMO_EMAIL = 'demo@willbe.dev';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    await queryInterface.bulkInsert('companies', [
      {
        id: COMPANY_ID,
        name: 'Willbe Demo',
        sector: 'Software Development',
        description:
          'Willbe Demo builds an AI-assisted outbound platform that finds the right accounts and leads ' +
          'and writes personalised LinkedIn and email sequences for B2B sales teams.',
        auto_sync_crm: false,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('companies_products_and_services', [
      {
        id: PRODUCT_ID,
        company_id: COMPANY_ID,
        name: 'Willbe Outbound Copilot',
        description:
          'Prospecting copilot that builds account and lead lists, generates multilingual outreach with LLMs ' +
          'and tracks replies and booked meetings across LinkedIn and email.',
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('users', [
      {
        id: USER_ID,
        first_name: 'Demo',
        last_name: 'User',
        email: DEMO_EMAIL,
        // Demo1234!
        password: '$2b$10$AD3sXug.YpsGn00eiRpC5OHj5bfJjzGiyhH7ovWp.PEEc479siMC6',
        position: 'Head of Sales',
        role: 'super_admin',
        language: 'en',
        company_id: COMPANY_ID,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('users_linkedin_accounts', [
      {
        id: LINKEDIN_ACCOUNT_ID,
        account_id: `mock-${USER_ID}`,
        user_id: USER_ID,
        sales_navigator: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', { id: USER_ID });
    await queryInterface.bulkDelete('companies', { id: COMPANY_ID });
  },
};
