import {
  CatalogItem,
  cities,
  companyNamePrefixes,
  companyNameSuffixes,
  companyTypes,
  firstNames,
  industries,
  jobTitles,
  lastNames,
  MockCity,
  MockJobTitle,
  schools,
  technologies,
} from './mock-catalog';

export interface MockCompany {
  id: string;
  name: string;
  slug: string;
  industry: CatalogItem;
  city: MockCity;
  headcount: number;
  headcountRange: { from: number; to: number };
  headcountGrowth: number;
  fortuneRank: number | null;
  followersCount: number;
  annualRevenueMillions: number;
  technologyIds: string[];
  hasJobOffers: boolean;
  recentActivities: string[];
  companyType: string;
  networkDistance: number;
  foundedYear: number;
  description: string;
}

export interface MockPerson {
  id: string;
  firstName: string;
  lastName: string;
  publicIdentifier: string;
  city: MockCity;
  languageCode: string;
  company: MockCompany;
  jobTitle: MockJobTitle;
  tenureAtRoleMonths: number;
  tenureAtCompanyMonths: number;
  experienceYears: number;
  pastJobTitleIds: string[];
  pastCompanyIds: string[];
  schoolId: string;
  networkDistance: number;
  postedOnLinkedin: boolean;
  mentionedInNews: boolean;
  viewedYourProfile: boolean;
  followingYourCompany: boolean;
  pastColleague: boolean;
  sharedExperiences: boolean;
  premium: boolean;
  openProfile: boolean;
  sharedConnectionsCount: number;
  recentPostsCount: number;
}

export interface MockDataset {
  companies: MockCompany[];
  companiesById: Map<string, MockCompany>;
  people: MockPerson[];
}

const HEADCOUNT_BUCKETS = [
  { from: 1, to: 10 },
  { from: 11, to: 50 },
  { from: 51, to: 200 },
  { from: 201, to: 500 },
  { from: 501, to: 1000 },
  { from: 1001, to: 5000 },
  { from: 5001, to: 10000 },
  { from: 10001, to: 50000 },
];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Random {
  private readonly next: () => number;

  constructor(seed: number) {
    this.next = mulberry32(seed);
  }

  float(): number {
    return this.next();
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  bool(probability = 0.5): boolean {
    return this.next() < probability;
  }

  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }

  sample<T>(items: readonly T[], count: number): T[] {
    return this.shuffle(items).slice(0, count);
  }

  shuffle<T>(items: readonly T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  token(length: number): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += alphabet[Math.floor(this.next() * alphabet.length)];
    }
    return result;
  }
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buildCompany(rnd: Random, index: number, name: string, industryIds: string[]): MockCompany {
  const industryId = rnd.pick(industryIds);
  const industry = industries.find((i) => i.id === industryId) ?? rnd.pick(industries);
  const city = rnd.pick(cities);
  const bucketIndex = Math.min(HEADCOUNT_BUCKETS.length - 1, Math.floor(rnd.float() ** 1.6 * HEADCOUNT_BUCKETS.length));
  const headcountRange = HEADCOUNT_BUCKETS[bucketIndex];
  const headcount = rnd.int(headcountRange.from, headcountRange.to);
  const foundedYear = rnd.int(1975, 2023);

  return {
    id: String(10_000_000 + index * 7_919),
    name,
    slug: slugify(name),
    industry,
    city,
    headcount,
    headcountRange,
    headcountGrowth: rnd.int(-15, 80),
    fortuneRank: headcount > 5000 && rnd.bool(0.6) ? rnd.int(1, 500) : null,
    followersCount: Math.round(headcount * rnd.int(3, 40)),
    annualRevenueMillions: Math.round(headcount * rnd.int(60, 400)) / 1000,
    technologyIds: rnd.sample(technologies, rnd.int(2, 6)).map((t) => t.id),
    hasJobOffers: rnd.bool(0.55),
    recentActivities: [
      ...(rnd.bool(0.2) ? ['senior_leadership_changes'] : []),
      ...(rnd.bool(0.15) ? ['funding_events'] : []),
    ],
    companyType: headcount > 1000 && rnd.bool(0.5) ? 'public_company' : rnd.pick(companyTypes.slice(1)),
    networkDistance: rnd.int(1, 3),
    foundedYear,
    description:
      `${name} is a ${industry.title.toLowerCase()} company headquartered in ${city.title.split(',')[0]}. ` +
      `Founded in ${foundedYear}, the team of ${headcount.toLocaleString('en-US')} people helps customers ` +
      `modernize their operations with data-driven products and dedicated support.`,
  };
}

function buildPerson(rnd: Random, company: MockCompany, companies: MockCompany[]): MockPerson {
  const firstName = rnd.pick(firstNames);
  const lastName = rnd.pick(lastNames);
  const jobTitle = rnd.pick(jobTitles);
  const city = rnd.bool(0.8) ? company.city : rnd.pick(cities);
  const experienceYears = rnd.int(1, 30);
  const tenureAtCompanyMonths = rnd.int(1, Math.min(experienceYears, 15) * 12);
  const tenureAtRoleMonths = rnd.int(1, tenureAtCompanyMonths);

  return {
    id: `ACwAA${rnd.token(34)}`,
    firstName,
    lastName,
    publicIdentifier: `${slugify(firstName)}-${slugify(lastName)}-${rnd.token(6).toLowerCase()}`,
    city,
    languageCode: city.country.languageCode,
    company,
    jobTitle,
    tenureAtRoleMonths,
    tenureAtCompanyMonths,
    experienceYears,
    pastJobTitleIds: rnd.sample(jobTitles, rnd.int(1, 3)).map((t) => t.id),
    pastCompanyIds: rnd
      .sample(companies, rnd.int(0, 3))
      .filter((c) => c.id !== company.id)
      .map((c) => c.id),
    schoolId: rnd.pick(schools).id,
    networkDistance: rnd.int(1, 3),
    postedOnLinkedin: rnd.bool(0.35),
    mentionedInNews: rnd.bool(0.08),
    viewedYourProfile: rnd.bool(0.05),
    followingYourCompany: rnd.bool(0.1),
    pastColleague: rnd.bool(0.04),
    sharedExperiences: rnd.bool(0.2),
    premium: rnd.bool(0.3),
    openProfile: rnd.bool(0.15),
    sharedConnectionsCount: rnd.int(0, 120),
    recentPostsCount: rnd.int(0, 25),
  };
}

export function generateMockDataset(seed = 20250604, companyCount = 400): MockDataset {
  const rnd = new Random(seed);

  const names = rnd
    .shuffle(
      companyNamePrefixes.flatMap((prefix) =>
        Object.entries(companyNameSuffixes).map(([suffix, industryIds]) => ({ name: `${prefix} ${suffix}`, industryIds })),
      ),
    )
    .slice(0, companyCount);
  const companies = names.map(({ name, industryIds }, index) => buildCompany(rnd, index + 1, name, industryIds));

  const people: MockPerson[] = [];
  for (const company of companies) {
    const count = Math.min(60, Math.max(3, Math.round(Math.log2(company.headcount + 1) * rnd.int(1, 3))));
    for (let i = 0; i < count; i++) {
      people.push(buildPerson(rnd, company, companies));
    }
  }

  return {
    companies,
    companiesById: new Map(companies.map((c) => [c.id, c])),
    people,
  };
}
