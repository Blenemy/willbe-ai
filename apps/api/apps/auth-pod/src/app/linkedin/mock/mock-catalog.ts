export interface CatalogItem {
  id: string;
  title: string;
}

export interface MockCity extends CatalogItem {
  country: CatalogItem & { languageCode: string };
  area: string;
}

export interface MockJobTitle extends CatalogItem {
  seniority: string;
  departmentId: string;
}

export const industries: CatalogItem[] = [
  { id: '4', title: 'Software Development' },
  { id: '6', title: 'Technology, Information and Internet' },
  { id: '96', title: 'IT Services and IT Consulting' },
  { id: '43', title: 'Financial Services' },
  { id: '41', title: 'Banking' },
  { id: '14', title: 'Hospitals and Health Care' },
  { id: '15', title: 'Pharmaceutical Manufacturing' },
  { id: '12', title: 'Biotechnology Research' },
  { id: '27', title: 'Retail' },
  { id: '34', title: 'Food and Beverage Services' },
  { id: '116', title: 'Transportation, Logistics, Supply Chain and Storage' },
  { id: '144', title: 'Renewable Energy Semiconductor Manufacturing' },
  { id: '80', title: 'Advertising Services' },
  { id: '104', title: 'Staffing and Recruiting' },
  { id: '11', title: 'Business Consulting and Services' },
  { id: '118', title: 'Computer and Network Security' },
  { id: '135', title: 'Industrial Machinery Manufacturing' },
  { id: '44', title: 'Real Estate' },
  { id: '68', title: 'Higher Education' },
  { id: '126', title: 'Media Production' },
];

const countries = {
  us: { id: '103644278', title: 'United States', languageCode: 'en' },
  uk: { id: '101165590', title: 'United Kingdom', languageCode: 'en' },
  fr: { id: '105015875', title: 'France', languageCode: 'fr' },
  es: { id: '105646813', title: 'Spain', languageCode: 'es' },
  de: { id: '101282230', title: 'Germany', languageCode: 'de' },
  il: { id: '101620260', title: 'Israel', languageCode: 'he' },
  nl: { id: '102890719', title: 'Netherlands', languageCode: 'nl' },
  ca: { id: '101174742', title: 'Canada', languageCode: 'en' },
};

export const cities: MockCity[] = [
  { id: '102277331', title: 'San Francisco, California, United States', area: 'California', country: countries.us },
  { id: '102571732', title: 'New York, New York, United States', area: 'New York', country: countries.us },
  { id: '104116203', title: 'Seattle, Washington, United States', area: 'Washington', country: countries.us },
  { id: '102380872', title: 'Boston, Massachusetts, United States', area: 'Massachusetts', country: countries.us },
  { id: '102748797', title: 'Austin, Texas, United States', area: 'Texas', country: countries.us },
  { id: '90009496', title: 'London, England, United Kingdom', area: 'England', country: countries.uk },
  { id: '102257491', title: 'Manchester, England, United Kingdom', area: 'England', country: countries.uk },
  { id: '106383538', title: 'Paris, Île-de-France, France', area: 'Île-de-France', country: countries.fr },
  { id: '103815258', title: 'Lyon, Auvergne-Rhône-Alpes, France', area: 'Auvergne-Rhône-Alpes', country: countries.fr },
  { id: '100994331', title: 'Madrid, Community of Madrid, Spain', area: 'Community of Madrid', country: countries.es },
  { id: '105088894', title: 'Barcelona, Catalonia, Spain', area: 'Catalonia', country: countries.es },
  { id: '106967730', title: 'Berlin, Berlin, Germany', area: 'Berlin', country: countries.de },
  { id: '100477049', title: 'Munich, Bavaria, Germany', area: 'Bavaria', country: countries.de },
  { id: '101570771', title: 'Tel Aviv, Tel Aviv District, Israel', area: 'Tel Aviv District', country: countries.il },
  { id: '102011674', title: 'Amsterdam, North Holland, Netherlands', area: 'North Holland', country: countries.nl },
  { id: '100025096', title: 'Toronto, Ontario, Canada', area: 'Ontario', country: countries.ca },
];

export const locations: CatalogItem[] = [
  ...Object.values(countries).map(({ id, title }) => ({ id, title })),
  ...cities.map(({ id, title }) => ({ id, title })),
];

export const departments: CatalogItem[] = [
  { id: '1', title: 'Accounting' },
  { id: '3', title: 'Business Development' },
  { id: '8', title: 'Engineering' },
  { id: '10', title: 'Finance' },
  { id: '12', title: 'Human Resources' },
  { id: '13', title: 'Information Technology' },
  { id: '15', title: 'Marketing' },
  { id: '18', title: 'Operations' },
  { id: '19', title: 'Product Management' },
  { id: '25', title: 'Sales' },
];

export const jobTitles: MockJobTitle[] = [
  { id: '8', title: 'Chief Executive Officer', seniority: 'cxo', departmentId: '3' },
  { id: '153', title: 'Chief Technology Officer', seniority: 'cxo', departmentId: '8' },
  { id: '68', title: 'Chief Financial Officer', seniority: 'cxo', departmentId: '10' },
  { id: '716', title: 'Chief Marketing Officer', seniority: 'cxo', departmentId: '15' },
  { id: '35', title: 'Founder', seniority: 'owner/partner', departmentId: '3' },
  { id: '103', title: 'Co-Founder', seniority: 'owner/partner', departmentId: '3' },
  { id: '1159', title: 'Managing Partner', seniority: 'owner/partner', departmentId: '18' },
  { id: '25', title: 'Vice President of Sales', seniority: 'vice_president', departmentId: '25' },
  { id: '189', title: 'Vice President of Engineering', seniority: 'vice_president', departmentId: '8' },
  { id: '317', title: 'Vice President of Marketing', seniority: 'vice_president', departmentId: '15' },
  { id: '1586', title: 'Director of Business Development', seniority: 'director', departmentId: '3' },
  { id: '2138', title: 'Director of Product', seniority: 'director', departmentId: '19' },
  { id: '191', title: 'IT Director', seniority: 'director', departmentId: '13' },
  { id: '1666', title: 'HR Director', seniority: 'director', departmentId: '12' },
  { id: '2387', title: 'Head of Operations', seniority: 'director', departmentId: '18' },
  { id: '1', title: 'Sales Manager', seniority: 'experienced_manager', departmentId: '25' },
  { id: '9', title: 'Engineering Manager', seniority: 'experienced_manager', departmentId: '8' },
  { id: '29', title: 'Marketing Manager', seniority: 'experienced_manager', departmentId: '15' },
  { id: '2', title: 'Product Manager', seniority: 'experienced_manager', departmentId: '19' },
  { id: '93', title: 'Finance Manager', seniority: 'entry_level_manager', departmentId: '10' },
  { id: '24', title: 'Account Executive', seniority: 'senior', departmentId: '25' },
  { id: '39', title: 'Senior Software Engineer', seniority: 'senior', departmentId: '8' },
  { id: '197', title: 'Senior Accountant', seniority: 'senior', departmentId: '1' },
  { id: '3', title: 'Business Development Representative', seniority: 'entry_level', departmentId: '3' },
  { id: '12', title: 'Sales Development Representative', seniority: 'entry_level', departmentId: '25' },
  { id: '255', title: 'Marketing Coordinator', seniority: 'entry_level', departmentId: '15' },
  { id: '4', title: 'Software Engineer', seniority: 'entry_level', departmentId: '8' },
  { id: '5000', title: 'Strategy Consultant', seniority: 'strategic', departmentId: '3' },
  { id: '5001', title: 'Sales Intern', seniority: 'in_training', departmentId: '25' },
];

export const schools: CatalogItem[] = [
  { id: '1503', title: 'Stanford University' },
  { id: '18483', title: 'Massachusetts Institute of Technology' },
  { id: '4387', title: 'University of Oxford' },
  { id: '12691', title: 'HEC Paris' },
  { id: '15096', title: 'IE Business School' },
  { id: '10236', title: 'Technical University of Munich' },
  { id: '5132', title: 'Tel Aviv University' },
  { id: '10920', title: 'University of Amsterdam' },
  { id: '10919', title: 'University of Toronto' },
  { id: '3067', title: 'London School of Economics' },
  { id: '18946', title: 'INSEAD' },
  { id: '4444', title: 'Universitat de Barcelona' },
];

export const technologies: CatalogItem[] = [
  { id: 'salesforce', title: 'Salesforce' },
  { id: 'hubspot', title: 'HubSpot' },
  { id: 'aws', title: 'Amazon Web Services' },
  { id: 'gcp', title: 'Google Cloud' },
  { id: 'azure', title: 'Microsoft Azure' },
  { id: 'react', title: 'React' },
  { id: 'kubernetes', title: 'Kubernetes' },
  { id: 'snowflake', title: 'Snowflake' },
  { id: 'stripe', title: 'Stripe' },
  { id: 'slack', title: 'Slack' },
  { id: 'zendesk', title: 'Zendesk' },
  { id: 'shopify', title: 'Shopify' },
];

export const personas: CatalogItem[] = [
  { id: 'p-decision-maker', title: 'Decision maker' },
  { id: 'p-tech-buyer', title: 'Technical buyer' },
  { id: 'p-champion', title: 'Champion' },
  { id: 'p-end-user', title: 'End user' },
];

export const companyTypes = [
  'public_company',
  'privately_held',
  'non_profit',
  'educational_institution',
  'partnership',
  'self_employed',
  'self_owned',
  'government_agency',
];

export const companyNamePrefixes = [
  'Nova', 'Blue', 'Bright', 'Apex', 'Quantum', 'Silver', 'Green', 'North', 'Iron', 'Lumen',
  'Vertex', 'Cobalt', 'Crimson', 'Atlas', 'Orbit', 'Pioneer', 'Summit', 'Harbor', 'Stellar', 'Echo',
  'Helix', 'Nimbus', 'Pulse', 'Zen', 'Vivid', 'Bold', 'Clear', 'Swift', 'True', 'Prime',
];

/** Company name suffix -> plausible industry ids. */
export const companyNameSuffixes: Record<string, string[]> = {
  Labs: ['12', '4', '68'],
  Systems: ['96', '135'],
  Analytics: ['6', '96'],
  Cloud: ['4', '6'],
  Dynamics: ['135', '11'],
  Works: ['11', '27'],
  Logic: ['4', '96'],
  Networks: ['6', '118'],
  Health: ['14', '15'],
  Capital: ['43', '41', '44'],
  Robotics: ['135'],
  Media: ['126', '80'],
  Foods: ['34', '27'],
  Energy: ['144'],
  Logistics: ['116'],
  Security: ['118'],
  Software: ['4'],
  Bio: ['12', '15'],
  Studio: ['80', '126'],
  Partners: ['11', '104', '44'],
};

export const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Lucas', 'Mia', 'Mason',
  'Chloé', 'Louis', 'Camille', 'Hugo', 'Léa', 'Lucía', 'Mateo', 'Sofía', 'Diego', 'Valeria',
  'Hannah', 'Felix', 'Lena', 'Jonas', 'Noa', 'Yael', 'Daniel', 'Tamar', 'Sanne', 'Daan',
  'Priya', 'Arjun', 'Mei', 'Kenji', 'Amara', 'Omar', 'Isabella', 'James', 'Charlotte', 'Benjamin',
];

export const lastNames = [
  'Smith', 'Johnson', 'Brown', 'Taylor', 'Anderson', 'Martin', 'Bernard', 'Dubois', 'Laurent', 'Moreau',
  'García', 'Martínez', 'López', 'Sánchez', 'Romero', 'Müller', 'Schmidt', 'Weber', 'Fischer', 'Wagner',
  'Cohen', 'Levi', 'Mizrahi', 'Peretz', 'de Vries', 'Jansen', 'Bakker', 'Patel', 'Chen', 'Tanaka',
  'Okafor', 'Haddad', 'Wilson', 'Clark', 'Walker', 'Young', 'King', 'Wright', 'Scott', 'Hill',
];
