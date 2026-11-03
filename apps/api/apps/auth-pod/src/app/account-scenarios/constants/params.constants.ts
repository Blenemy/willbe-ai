import currencyCodes from 'currency-codes';

export const headcounts = {
  from: ['1', '11', '51', '201', '501', '1001', '5001', '10001'],
  to: ['10', '50', '200', '500', '1000', '5000', '10000'],
};

export const fortunes = {
  from: ['0', '51', '101', '251'],
  to: ['50', '100', '250', '500'],
};

export const followersCounts = {
  from: ['0', '51', '101', '1001', '5001'],
  to: ['50', '100', '1000', '5000'],
};

export const recentActivities = [
  {
    title: 'Senior Leadership Changes',
    value: 'senior_leadership_changes',
  },
  {
    title: 'Funding Events',
    value: 'funding_events',
  },
];

export const networkDistances = [
  { title: '1st', value: '1' },
  { title: '2nd', value: '2' },
  { title: '3rd', value: '3' },
];

const currencies = currencyCodes.data.map((c) => c.code);

export const annualRevenues = {
  from: ['0.2', '1', '2.5', '5', '10', '20', '50', '100', '500', '1000'],
  to: ['1', '2.5', '5', '10', '20', '50', '100', '500', '1000'],
  currencies,
};
