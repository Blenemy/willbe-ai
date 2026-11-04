// Builds a showcase dataset for the demo workspace.
// Data is created through the public API (so it goes through the same code paths as the UI, backed by the mock
// LinkedIn provider), then activity is spread over the last weeks directly in the database so dashboards have history.
//
// Prerequisites: migrations + `npm run seed:all` applied, API running with LINKEDIN_PROVIDER=mock and EMAIL_DELIVERY=mock.
// Usage (from apps/api): npm run seed:demo [-- http://localhost:3000/auth]
// The script is re-runnable: it wipes all scenarios, saved accounts/leads and campaign activity first.
import 'dotenv/config';
import { createHash, randomUUID } from 'node:crypto';
import pg from 'pg';

const BASE_URL = process.argv[2] ?? process.env.API_PUBLIC_URL ?? 'http://localhost:3000/auth';
const CREDENTIALS = { email: 'demo@willbe.dev', password: 'Demo1234!' };
const COMPANY_ID = '6f1c2a5e-3b8d-4c1f-9a2e-7d4b5c6e8f01';
const PRODUCT_ID = '8a2d3b6f-4c9e-4d2a-8b3f-9e5c6d7f8a02';
const DEMO_PASSWORD_HASH = '$2b$10$AD3sXug.YpsGn00eiRpC5OHj5bfJjzGiyhH7ovWp.PEEc479siMC6';
const STRUCTURES = {
  linkedinConnection: 'c1a2b3c4-1111-4a1b-8c1d-000000000001',
  linkedinMessage: 'c1a2b3c4-2222-4a1b-8c1d-000000000002',
  email: 'c1a2b3c4-3333-4a1b-8c1d-000000000003',
};

const ACCOUNT_SCENARIOS = [
  {
    name: 'SaaS and IT in Europe',
    daysAgo: 38,
    save: 18,
    filters: [
      { key: 'industry', type: 'INDUSTRY', keywords: ['Software Development', 'IT Services and IT Consulting'] },
      { key: 'location', type: 'LOCATION', keywords: ['Germany', 'Austria', 'Switzerland', 'Netherlands', 'United Kingdom'] },
    ],
  },
  {
    name: 'Fintech and banking',
    daysAgo: 26,
    save: 14,
    filters: [
      { key: 'industry', type: 'INDUSTRY', keywords: ['Financial Services', 'Banking'] },
    ],
  },
  {
    name: 'Healthcare providers',
    daysAgo: 6,
    save: 12,
    filters: [
      { key: 'industry', type: 'INDUSTRY', keywords: ['Hospitals and Health Care', 'Medical Equipment Manufacturing', 'Pharmaceutical Manufacturing'] },
    ],
  },
  {
    name: 'Logistics and supply chain',
    daysAgo: 2,
    save: 10,
    filters: [
      { key: 'industry', type: 'INDUSTRY', keywords: ['Transportation, Logistics, Supply Chain and Storage'] },
    ],
  },
];

const LEAD_SCENARIOS = [
  {
    name: 'Sales leaders at DACH SaaS',
    daysAgo: 32,
    save: 22,
    filters: [
      { key: 'seniority', value: { include: ['vp', 'director', 'cxo'], exclude: [] } },
      { key: 'company_industry', type: 'INDUSTRY', keywords: ['Software Development'] },
      { key: 'location', type: 'LOCATION', keywords: ['Germany', 'Austria', 'Switzerland'] },
    ],
  },
  {
    name: 'Marketing heads in fintech',
    daysAgo: 18,
    save: 18,
    filters: [
      { key: 'department', type: 'DEPARTMENT', keywords: ['Marketing'] },
      { key: 'seniority', value: { include: ['director', 'vp', 'cxo'], exclude: [] } },
      { key: 'company_industry', type: 'INDUSTRY', keywords: ['Financial Services', 'Banking'] },
    ],
  },
  {
    name: 'Engineering leaders, healthtech',
    daysAgo: 6,
    save: 20,
    filters: [
      { key: 'department', type: 'DEPARTMENT', keywords: ['Engineering'] },
      { key: 'seniority', value: { include: ['cxo', 'vp', 'director'], exclude: [] } },
      { key: 'company_industry', type: 'INDUSTRY', keywords: ['Hospitals and Health Care'] },
    ],
  },
  {
    name: 'Founders of early-stage startups',
    daysAgo: 4,
    save: 20,
    filters: [
      { key: 'seniority', value: { include: ['owner/partner', 'cxo'], exclude: [] } },
      { key: 'company_headcount', value: { from: '1', to: '50' } },
    ],
  },
  {
    name: 'Operations leaders in logistics',
    daysAgo: 1,
    save: 12,
    filters: [
      { key: 'department', type: 'DEPARTMENT', keywords: ['Operations'] },
      { key: 'seniority', value: { include: ['director', 'vp', 'cxo'], exclude: [] } },
      { key: 'company_industry', type: 'INDUSTRY', keywords: ['Transportation, Logistics, Supply Chain and Storage'] },
    ],
  },
];

// One campaign per lead scenario (same order). `daysAgo` is when the first emails went out.
const CAMPAIGNS = [
  { name: 'DACH SaaS: Q3 outbound', daysAgo: 28, status: 'done', send: true, linkedin: false },
  { name: 'Fintech marketing push', daysAgo: 14, status: 'in_progress', send: true, linkedin: true },
  { name: 'Healthtech CTO intro', daysAgo: 5, status: 'in_progress', send: true, linkedin: true },
  { name: 'Founders: seed-stage intro', daysAgo: 3, status: 'in_progress', send: true, linkedin: false },
  { name: 'Logistics operations: draft', daysAgo: 0, status: 'not_started', send: false, linkedin: false },
];

const OUTCOMES = [
  'meeting', 'not_answered', 'response', 'out_of_office', 'not_answered', 'meeting',
  'not_answered', 'response', 'bounced', 'not_answered', 'not_answered',
];

const QUARTERLY_GOAL = { goal: 20000, won: 16000, pipeline: 60000 };

const TEAMMATES = [
  { id: 'a7d1c3e5-1b2f-4c6d-8e9f-0a1b2c3d4e05', first: 'Sofia', last: 'Marino', email: 'sofia@willbe.dev', role: 'admin', position: 'SDR Team Lead' },
  { id: 'b8e2d4f6-2c3a-4d7e-9f0a-1b2c3d4e5f06', first: 'Lukas', last: 'Becker', email: 'lukas@willbe.dev', role: 'member', position: 'Account Executive' },
];

const REPLIES = [
  'Thanks for reaching out! The timing is good, we are reviewing our outbound stack this quarter. Could we talk next week?',
  'Interesting. Can you share a short case study from a company of a similar size?',
  'Happy to chat. Tuesday afternoon works for me, feel free to send an invite.',
  'Not a priority right now, but please follow up in a couple of months.',
  'Looping in my colleague who owns this topic. Let us find a slot for a 30 minute call.',
];
const OUT_OF_OFFICE_REPLY = 'I am out of the office until next Monday with limited access to email. I will reply when I am back.';

let token;

async function api(method, path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${method} ${path} -> ${response.status}: ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

/** Stable pseudo-random number in [0, 1) so re-running the seed produces the same picture. */
function roll(key) {
  return createHash('sha256').update(String(key)).digest().readUInt32BE(0) / 2 ** 32;
}

async function resolveParams(type, keywords) {
  const found = [];
  for (const keyword of keywords) {
    const items = await api('GET', `/scenario-params?type=${type}&keywords=${encodeURIComponent(keyword)}`);
    const exact = items.find((item) => item.title === keyword) ?? items[0];
    if (exact) {
      found.push({ id: exact.id, title: exact.title });
    }
  }
  return found;
}

async function buildFilterValues(filters) {
  const values = [];
  for (const filter of filters) {
    if (filter.type) {
      const include = await resolveParams(filter.type, filter.keywords);
      if (include.length) {
        values.push({ filterKey: filter.key, filterValue: { include, exclude: [] } });
      }
    } else {
      values.push({ filterKey: filter.key, filterValue: filter.value });
    }
  }
  return values;
}

async function resetDatabase(db) {
  await db.query(`
    TRUNCATE received_messages, sent_email_messages, message_entries_leads_data, message_entries,
      message_scenarios_leads, message_scenarios, leads_search_results, saved_leads,
      lead_scenarios_filters_values, lead_scenarios_filters, lead_scenarios,
      accounts_search_results, saved_accounts, account_scenarios_filters_values, account_scenarios
    CASCADE
  `);

  for (const teammate of TEAMMATES) {
    await db.query(
      `INSERT INTO users (id, first_name, last_name, email, password, position, role, language, company_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'en', $8, now() - interval '40 days', now())
       ON CONFLICT (id) DO NOTHING`,
      [teammate.id, teammate.first, teammate.last, teammate.email, DEMO_PASSWORD_HASH, teammate.position, teammate.role, COMPANY_ID],
    );
  }

  await db.query(`DELETE FROM users_invitations WHERE company_id = $1`, [COMPANY_ID]);
  await db.query(
    `INSERT INTO users_invitations (id, email, role, position, is_accepted, company_id, created_at, updated_at)
     VALUES ($1, 'maria@willbe.dev', 'member', 'Sales Development Rep', false, $2, now() - interval '2 days', now())`,
    [randomUUID(), COMPANY_ID],
  );

  const now = new Date();
  const quarter = `${now.getUTCFullYear()}-Q${Math.floor(now.getUTCMonth() / 3) + 1}`;
  await db.query(
    `INSERT INTO company_quarterly_goals (id, company_id, quarter, goal_amount, won_amount, pipeline_amount, currency, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'EUR', now(), now())
     ON CONFLICT (company_id, quarter) DO UPDATE
     SET goal_amount = EXCLUDED.goal_amount, won_amount = EXCLUDED.won_amount, pipeline_amount = EXCLUDED.pipeline_amount, updated_at = now()`,
    [randomUUID(), COMPANY_ID, quarter, QUARTERLY_GOAL.goal, QUARTERLY_GOAL.won, QUARTERLY_GOAL.pipeline],
  );
}

async function seedAccountScenarios(db) {
  for (const scenario of ACCOUNT_SCENARIOS) {
    const created = await api('POST', '/account-scenarios', { name: scenario.name });
    await api('PATCH', `/account-scenarios/${created.id}`, { filterValues: await buildFilterValues(scenario.filters) });
    const found = await api('GET', `/account-scenarios/${created.id}/accounts?limit=${scenario.save}`);
    await api('POST', `/account-scenarios/${created.id}/accounts`, { accounts: found.items });

    await db.query(`UPDATE account_scenarios SET created_at = now() - make_interval(days => $2) WHERE id = $1`, [created.id, scenario.daysAgo]);
    await db.query(`UPDATE saved_accounts SET created_at = now() - make_interval(days => $2) WHERE account_scenario_id = $1`, [created.id, scenario.daysAgo]);
    console.log(`account scenario  ${scenario.name}: ${found.items.length} of ${found.paging.total_count} saved`);
  }
}

async function seedLeadScenarios(db) {
  const scenarios = [];
  for (const scenario of LEAD_SCENARIOS) {
    const created = await api('POST', '/lead-scenarios', { name: scenario.name });
    await api('POST', '/lead-scenarios-filters', { leadScenarioId: created.id, filterValues: await buildFilterValues(scenario.filters) });
    const found = await api('GET', `/lead-scenarios/${created.id}/leads?limit=${scenario.save}`);
    await api('POST', `/lead-scenarios/${created.id}/leads`, { leads: found.items });
    const saved = await api('GET', `/lead-scenarios/${created.id}/saved-leads`);

    await db.query(`UPDATE lead_scenarios SET created_at = now() - make_interval(days => $2) WHERE id = $1`, [created.id, scenario.daysAgo]);
    await db.query(`UPDATE saved_leads SET created_at = now() - make_interval(days => $2) WHERE lead_scenario_id = $1`, [created.id, scenario.daysAgo]);
    await db.query(
      `UPDATE saved_accounts SET created_at = LEAST(created_at, now() - make_interval(days => $1)) WHERE company_id = $2 AND account_scenario_id IS NULL`,
      [scenario.daysAgo, COMPANY_ID],
    );
    console.log(`lead scenario     ${scenario.name}: ${saved.length} of ${found.paging.total_count} saved`);
    scenarios.push({ id: created.id, leadIds: saved.map((lead) => lead.id) });
  }
  return scenarios;
}

async function createEntry(messageScenarioId, type, structureId, { generate }) {
  const entry = await api('POST', '/message-campaign-entries', { messageScenarioId, type, sendNow: true });
  const { messageEntryLeadData } = await api('GET', `/message-campaign-entries/${entry.id}`);
  const ids = messageEntryLeadData.map((leadData) => leadData.id);

  await api('PATCH', '/message-campaign-entries/leads/bulk', { leadIds: ids, messageStructureId: structureId, productServiceId: PRODUCT_ID });
  for (const id of ids) {
    await api('POST', `/message-campaign-entries/search-language?messageEntryLeadDataId=${id}`);
  }
  if (generate) {
    await api('POST', '/message-campaign-entries/generate-messages', { messageEntryDataIds: ids });
  }
  return { id: entry.id, ids };
}

async function seedCampaign(db, campaign, leadScenario) {
  const scenario = await api('POST', '/message-scenarios/create-with-leads', {
    leadScenarioId: leadScenario.id,
    leadsIds: leadScenario.leadIds,
  });
  await api('PATCH', `/message-scenarios/${scenario.id}`, { name: campaign.name });

  const email = await api('POST', '/message-campaign-entries', { messageScenarioId: scenario.id, type: 'first_email', sendNow: true });
  const { messageEntryLeadData } = await api('GET', `/message-campaign-entries/${email.id}`);
  const ids = messageEntryLeadData.map((leadData) => leadData.id);

  await api('PATCH', '/message-campaign-entries/leads/bulk', { leadIds: ids, messageStructureId: STRUCTURES.email, productServiceId: PRODUCT_ID });
  for (const id of ids) {
    await api('POST', `/message-campaign-entries/search-language?messageEntryLeadDataId=${id}`);
  }
  await api('POST', '/message-campaign-entries/search-email', { messageEntryDataIds: ids });
  await api('POST', '/message-campaign-entries/search-phone', { messageEntryDataIds: ids });
  await api('POST', '/message-campaign-entries/generate-messages', { messageEntryDataIds: ids });
  if (campaign.send) {
    await api('POST', '/message-campaign-entries/send-messages', { messageEntryDataIds: ids });
    await waitForSentEmails(db, scenario.id, ids.length);
  }

  if (campaign.linkedin) {
    await createEntry(scenario.id, 'linkedin_connection', STRUCTURES.linkedinConnection, { generate: true });
    await createEntry(scenario.id, 'linkedin_message', STRUCTURES.linkedinMessage, { generate: true });
  }

  await backdateCampaign(db, scenario.id, campaign);
  console.log(`campaign          ${campaign.name}: ${ids.length} leads, ${campaign.status}`);
}

/** Sending is processed by a background queue, so wait until every email is recorded before rewriting history. */
async function waitForSentEmails(db, scenarioId, expected) {
  for (let attempt = 0; attempt < 60; attempt++) {
    const { rows } = await db.query(`SELECT count(*)::int AS count FROM sent_email_messages WHERE message_scenario_id = $1`, [scenarioId]);
    if (rows[0].count >= expected) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${expected} sent emails in scenario ${scenarioId}`);
}

async function backdateCampaign(db, scenarioId, campaign) {
  await db.query(
    `UPDATE message_scenarios SET status = $2, created_at = now() - make_interval(days => $3) - interval '1 day' WHERE id = $1`,
    [scenarioId, campaign.status, campaign.daysAgo],
  );
  await db.query(
    `UPDATE message_entries
     SET created_at = now() - make_interval(days => $2) - interval '1 day',
         send_now = false,
         send_date = now() - make_interval(days => $2),
         send_date_utc = now() - make_interval(days => $2)
     WHERE message_scenario_id = $1 AND type = 'first_email'`,
    [scenarioId, campaign.daysAgo],
  );
  await db.query(
    `UPDATE message_entries
     SET send_now = false,
         send_date = now() + interval '2 days',
         send_date_utc = now() + interval '2 days'
     WHERE message_scenario_id = $1 AND type <> 'first_email'`,
    [scenarioId],
  );

  if (!campaign.send) {
    return;
  }

  const { rows: sent } = await db.query(
    `SELECT id, message_entry_lead_data_id FROM sent_email_messages WHERE message_scenario_id = $1 ORDER BY id`,
    [scenarioId],
  );

  const shift = Math.floor(roll(campaign.name) * OUTCOMES.length);

  for (const [index, message] of sent.entries()) {
    const sentDaysAgo = Math.max(campaign.daysAgo - (index % 4), 0.2);
    const sentAt = new Date(Date.now() - sentDaysAgo * 86_400_000 + roll(`${message.id}:hour`) * 6 * 3_600_000);
    const replyAt = new Date(Math.min(sentAt.getTime() + (2 + roll(`${message.id}:reply-delay`) * 46) * 3_600_000, Date.now() - 60_000));
    const outcome = OUTCOMES[(index + shift) % OUTCOMES.length];

    let status = 'not_answered';
    let leadStatus = 'in_cadence';
    let reply = null;

    if (outcome === 'meeting' || outcome === 'response') {
      status = 'responded';
      reply = REPLIES[Math.floor(roll(`${message.id}:text`) * REPLIES.length)];
      leadStatus = outcome;
    } else if (outcome === 'out_of_office') {
      status = 'out_of_office';
      reply = OUT_OF_OFFICE_REPLY;
    } else if (outcome === 'bounced') {
      status = 'bounced';
      leadStatus = 'bounced';
    }

    await db.query(
      `UPDATE sent_email_messages
       SET status = $2, sent_at = $3::timestamptz, responded_at = $4::timestamptz,
           created_at = $3::timestamptz, updated_at = COALESCE($4::timestamptz, $3::timestamptz)
       WHERE id = $1`,
      [message.id, status, sentAt, reply ? replyAt : null],
    );
    await db.query(`DELETE FROM received_messages WHERE sent_email_message_id = $1`, [message.id]);
    if (reply) {
      await db.query(
        `INSERT INTO received_messages (id, message, sent_email_message_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)`,
        [randomUUID(), reply, message.id, replyAt],
      );
    }
    await db.query(
      `UPDATE message_entries_leads_data
       SET status = $2::enum_message_entries_leads_data_status, updated_at = $3::timestamptz
       WHERE id = $1`,
      [message.message_entry_lead_data_id, leadStatus, reply || leadStatus === 'bounced' ? replyAt : sentAt],
    );
  }
}

async function main() {
  const db = new pg.Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  await db.connect();

  try {
    token = (await api('POST', '/login', CREDENTIALS)).accessToken;
    await resetDatabase(db);
    await seedAccountScenarios(db);
    const leadScenarios = await seedLeadScenarios(db);
    for (const [index, campaign] of CAMPAIGNS.entries()) {
      await seedCampaign(db, campaign, leadScenarios[index]);
    }
    console.log('Demo data ready. Sign in as demo@willbe.dev / Demo1234!');
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
