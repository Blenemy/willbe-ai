type Range = {
  from: string[];
  to: string[];
};

type Activity = {
  title: string;
  value: string;
};

type Distance = {
  title: string;
  value: string;
};

type AnnualRevenue = {
  from: string[];
  to: string[];
  currencies: string[];
};

export type AccountScenarioDropdowns = {
  headcounts: Range;
  fortunes: Range;
  followersCounts: Range;
  recentActivities: Activity[];
  networkDistances: Distance[];
  annualRevenues: AnnualRevenue;
};
