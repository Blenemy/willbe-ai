// End-to-end smoke test of the demo flow against a running API (mock LinkedIn provider, mock email delivery).
// Usage: node scripts/smoke-test.mjs [baseUrl]
const BASE_URL = process.argv[2] ?? 'http://localhost:3000/auth';
const CREDENTIALS = { email: 'demo@willbe.dev', password: 'Demo1234!' };
const PRODUCT_ID = '8a2d3b6f-4c9e-4d2a-8b3f-9e5c6d7f8a02';
const EMAIL_STRUCTURE_ID = 'c1a2b3c4-3333-4a1b-8c1d-000000000003';

let token;

async function call(method, path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`${method} ${path} -> ${response.status}: ${text}`);
  }
  return data;
}

function step(name, details = '') {
  console.log(`ok  ${name}${details ? ` (${details})` : ''}`);
}

const login = await call('POST', '/login', CREDENTIALS);
token = login.accessToken ?? login.access_token ?? login.tokens?.accessToken;
step('login');

const me = await call('GET', '/me');
step('me', `salesNavigator=${me.accounts?.salesNavigator}`);

const leadScenario = await call('POST', '/lead-scenarios', { name: `Smoke test ${new Date().toISOString()}` });
await call('POST', '/lead-scenarios-filters', {
  leadScenarioId: leadScenario.id,
  filterValues: [{ filterKey: 'seniority', filterValue: { include: ['director', 'vp', 'cxo'], exclude: [] } }],
});
const found = await call('GET', `/lead-scenarios/${leadScenario.id}/leads?limit=5`);
step('search leads', `${found.items.length} of ${found.paging.total_count}`);

await call('POST', `/lead-scenarios/${leadScenario.id}/leads`, { leads: found.items });
const saved = await call('GET', `/lead-scenarios/${leadScenario.id}/saved-leads`);
const savedLeads = Array.isArray(saved) ? saved : saved.items ?? saved.rows;
step('save leads', `${savedLeads.length} saved`);

const messageScenario = await call('POST', '/message-scenarios/create-with-leads', {
  leadScenarioId: leadScenario.id,
  leadsIds: savedLeads.map((lead) => lead.id),
});
step('create message scenario', messageScenario.id);

const entries = await call('POST', '/message-campaign-entries', {
  messageScenarioId: messageScenario.id,
  type: 'first_email',
  sendNow: true,
});
const entry = await call('GET', `/message-campaign-entries/${entries.id}`);
const leadsData = entry.messageEntryLeadData;
const leadDataIds = leadsData.map((leadData) => leadData.id);
step('create email entry', `${leadDataIds.length} leads`);

await call('PATCH', '/message-campaign-entries/leads/bulk', {
  leadIds: leadDataIds,
  messageStructureId: EMAIL_STRUCTURE_ID,
  productServiceId: PRODUCT_ID,
});
for (const id of leadDataIds) {
  await call('POST', `/message-campaign-entries/search-language?messageEntryLeadDataId=${id}`);
}
step('bulk update + detect language');

await call('POST', '/message-campaign-entries/search-email', { messageEntryDataIds: leadDataIds });
await call('POST', '/message-campaign-entries/search-phone', { messageEntryDataIds: leadDataIds });
await call('POST', '/message-campaign-entries/generate-messages', { messageEntryDataIds: leadDataIds });

const generated = await call('GET', `/message-campaign-entries/${entries.id}`);
const sample = (generated.messageEntryLeadData).find((leadData) => leadData.message);
step('enrich + generate', sample ? `${sample.email} / ${sample.phone} / ${sample.language}` : 'no message yet');
if (sample) {
  console.log(`    ${sample.message.replace(/<br>/g, '\n    ')}`);
}

await call('POST', '/message-campaign-entries/send-messages', { messageEntryDataIds: leadDataIds });
step('send messages');

const [meetings, rates, performance] = await Promise.all([
  call('GET', '/home/meetings'),
  call('GET', '/home/meetings-responses-rate'),
  call('GET', '/home/scenario-performance'),
]);
step('home dashboard', `meetings=${meetings.length ?? meetings.items?.length} rates=${JSON.stringify(rates)}`);
console.log(`    performance: ${JSON.stringify(performance)}`);
