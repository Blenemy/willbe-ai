import { LinkedinCompanyProfile } from '../linkedin.provider';
import { jobTitles, schools } from './mock-catalog';
import { MockCompany, MockPerson } from './mock-dataset';

type Predicate<T> = (item: T) => boolean;

interface IncludeExclude {
  include?: string[];
  exclude?: string[];
}

interface Range {
  min?: number;
  max?: number;
}

const avatarUrl = (seed: string, style: 'initials' | 'notionists') =>
  `https://api.dicebear.com/9.x/${style}/png?seed=${encodeURIComponent(seed)}&size=200`;

function inRange(value: number | null, range: Range | Range[] | undefined): boolean {
  const ranges = Array.isArray(range) ? range : range ? [range] : [];
  if (!ranges.length) {
    return true;
  }
  if (value === null) {
    return false;
  }
  return ranges.some(({ min, max }) => {
    const lower = Number.isFinite(min) ? Number(min) : -Infinity;
    const upper = Number.isFinite(max) && Number(max) > 0 ? Number(max) : Infinity;
    return value >= lower && value <= upper;
  });
}

function matchesIds(values: string[], filter: IncludeExclude | undefined): boolean {
  if (!filter) {
    return true;
  }
  if (filter.include?.length && !values.some((v) => filter.include.includes(String(v)))) {
    return false;
  }
  if (filter.exclude?.length && values.some((v) => filter.exclude.includes(String(v)))) {
    return false;
  }
  return true;
}

function matchesKeywords(haystack: string[], keywords: unknown): boolean {
  if (typeof keywords !== 'string' || !keywords.trim()) {
    return true;
  }
  const text = haystack.join(' ').toLowerCase();
  return keywords
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => text.includes(word));
}

function startsWith(value: string, query: unknown): boolean {
  return typeof query !== 'string' || !query || value.toLowerCase().startsWith(query.toLowerCase());
}

const flag = (expected: unknown, actual: boolean) => expected !== true || actual;

export function buildPeoplePredicate(body: Record<string, any>): Predicate<MockPerson> {
  return (p) => {
    const company = p.company;
    const tenureAtRole = p.tenureAtRoleMonths / 12;
    const tenureAtCompany = p.tenureAtCompanyMonths / 12;

    return (
      startsWith(p.firstName, body.first_name) &&
      startsWith(p.lastName, body.last_name) &&
      (!body.profile_language?.length || body.profile_language.includes(p.languageCode)) &&
      matchesIds([p.jobTitle.id], body.role) &&
      matchesIds(p.pastJobTitleIds, body.past_role) &&
      matchesIds([p.jobTitle.seniority], body.seniority) &&
      matchesIds([p.jobTitle.departmentId], body.function) &&
      matchesIds([p.schoolId], body.school) &&
      matchesIds([p.city.id, p.city.country.id], body.location) &&
      matchesIds([company.id], body.company) &&
      matchesIds(p.pastCompanyIds, body.past_company) &&
      matchesIds([company.industry.id], body.industry) &&
      matchesIds([company.city.id, company.city.country.id], body.company_location) &&
      (!body.company_type?.length || body.company_type.includes(company.companyType)) &&
      (!body.network_distance?.length || body.network_distance.includes(p.networkDistance)) &&
      inRange(tenureAtRole, body.tenure_at_role) &&
      inRange(tenureAtCompany, body.tenure_at_company) &&
      inRange(p.experienceYears, body.tenure) &&
      inRange(company.headcount, body.company_headcount) &&
      flag(body.posted_on_linkedin, p.postedOnLinkedin) &&
      flag(body.mentionned_in_news, p.mentionedInNews) &&
      flag(body.viewed_your_profile_recently, p.viewedYourProfile) &&
      flag(body.following_your_company, p.followingYourCompany) &&
      flag(body.past_colleague, p.pastColleague) &&
      flag(body.shared_experiences, p.sharedExperiences) &&
      flag(body.changed_jobs, tenureAtCompany < 0.25) &&
      matchesKeywords(
        [p.firstName, p.lastName, p.jobTitle.title, company.name, company.industry.title, p.city.title],
        body.keywords,
      )
    );
  };
}

export function buildCompaniesPredicate(body: Record<string, any>): Predicate<MockCompany> {
  return (c) =>
    matchesIds([c.industry.id], body.industry) &&
    matchesIds([c.city.id, c.city.country.id], body.location) &&
    inRange(c.headcount, body.headcount) &&
    inRange(c.headcountGrowth, body.headcount_growth) &&
    inRange(c.fortuneRank, body.fortune) &&
    inRange(c.followersCount, body.followers_count) &&
    inRange(c.annualRevenueMillions, body.annual_revenue) &&
    (!body.recent_activities?.length || body.recent_activities.some((a: string) => c.recentActivities.includes(a))) &&
    flag(body.has_job_offers, c.hasJobOffers) &&
    (!body.technologies?.length || body.technologies.some((t: string) => c.technologyIds.includes(t))) &&
    (!body.network_distance?.length || body.network_distance.includes(c.networkDistance)) &&
    matchesKeywords([c.name, c.industry.title, c.description], body.keywords);
}

const formatHeadcountRange = ({ from, to }: { from: number; to: number }) =>
  to >= 50000 ? `${from}+` : `${from}-${to}`;

const tenure = (months: number) => ({ years: Math.floor(months / 12), months: months % 12 });

export function toPersonItem(p: MockPerson) {
  const name = `${p.firstName} ${p.lastName}`;
  const role = p.jobTitle.title;
  const past = jobTitles.find((t) => t.id === p.pastJobTitleIds[0]);
  const school = schools.find((s) => s.id === p.schoolId);

  return {
    object: 'SearchResult',
    type: 'PEOPLE',
    id: p.id,
    name,
    first_name: p.firstName,
    last_name: p.lastName,
    member_urn: `urn:li:member:${parseInt(p.company.id, 10) + p.id.length}`,
    public_identifier: p.publicIdentifier,
    public_profile_url: `https://www.linkedin.com/in/${p.publicIdentifier}`,
    profile_url: `https://www.linkedin.com/sales/lead/${p.id}`,
    profile_picture_url: avatarUrl(name, 'notionists'),
    profile_picture_url_large: avatarUrl(name, 'notionists'),
    network_distance: `DISTANCE_${p.networkDistance}`,
    location: p.city.title,
    industry: p.company.industry.title,
    headline: `${role} at ${p.company.name}`,
    summary:
      `${role} with ${p.experienceYears} years of experience` +
      (past ? `, previously ${past.title}` : '') +
      (school ? `. Alumni of ${school.title}.` : '.'),
    pending_invitation: false,
    open_profile: p.openProfile,
    premium: p.premium,
    shared_connections_count: p.sharedConnectionsCount,
    recent_posts_count: p.recentPostsCount,
    hasSalesNavigator: true,
    current_positions: [
      {
        company: p.company.name,
        company_id: p.company.id,
        description: null,
        role,
        location: p.city.title,
        industry: [p.company.industry.title],
        tenure_at_role: tenure(p.tenureAtRoleMonths),
        tenure_at_company: tenure(p.tenureAtCompanyMonths),
      },
    ],
  };
}

export function toCompanyItem(c: MockCompany) {
  return {
    object: 'SearchResult',
    type: 'COMPANY',
    id: c.id,
    name: c.name,
    profile_url: `https://www.linkedin.com/sales/company/${c.id}`,
    summary: c.description,
    industry: c.industry.title,
    location: c.city.title,
    headcount: formatHeadcountRange(c.headcountRange),
    logo: avatarUrl(c.name, 'initials'),
    founded_year: String(c.foundedYear),
    website: `https://www.${c.slug}.example.com`,
  };
}

export function toCompanyProfile(c: MockCompany): LinkedinCompanyProfile {
  const industry = c.industry.title;
  return {
    id: c.id,
    name: c.name,
    description: c.description,
    industry: [industry],
    industries: [industry],
    logo_large: avatarUrl(c.name, 'initials'),
    website: `https://www.${c.slug}.example.com`,
    profile_url: `https://www.linkedin.com/company/${c.slug}`,
    locations: [
      {
        city: c.city.title.split(',')[0],
        country: c.city.country.title,
        area: c.city.area,
      },
    ],
    employee_count_range: c.headcountRange,
  };
}
