import ISO6391 from 'iso-639-1';

export const paramsTypes = [
  'JOB_TITLE',
  'DEPARTMENT',
  'SCHOOL',
  'LOCATION',
  'COMPANY',
  'INDUSTRY',
  'PERSONA',
  'TECHNOLOGIES',
  'SAVED_ACCOUNTS',
];

export const languages = ISO6391.getAllNames();

export const tenuresAtJobTitle = {
  from: ['0', '1', '3', '6', '10'],
  to: ['1', '2', '5', '10'],
};

export const seniorities = [
  { title: 'Owner / Partner', value: 'owner/partner' },
  { title: 'CXO', value: 'cxo' },
  { title: 'Vice president', value: 'vice_president' },
  { title: 'Director', value: 'director' },
  { title: 'Experienced manager', value: 'experienced_manager' },
  { title: 'Entry level manager', value: 'entry_level_manager' },
  { title: 'Strategic', value: 'strategic' },
  { title: 'Senior', value: 'senior' },
  { title: 'Entry level', value: 'entry_level' },
  { title: 'In training', value: 'in_training' },
];

export const totalYearsOfExpirience = {
  from: ['0', '1', '3', '6', '10'],
  to: ['1', '2', '5', '10'],
};

export const networkDistances = [
  { title: '1st', value: '2' },
  { title: '2nd', value: '1' },
  { title: '3rd', value: '3' },
];

export const companyHeadcounts = {
  from: ['1', '11', '51', '201', '501', '1001', '5001', '10001'],
  to: ['10', '50', '200', '500', '1000', '5000', '10000'],
};

export const companyTypes = [
  'Public company',
  'Privately held',
  'Non profit',
  'Educational institution',
  'Partnership',
  'Self employed',
  'Self owned',
  'Government agency',
];

export const tenuresAtCompany= {
  from: ['0', '1', '3', '6', '10'],
  to: ['1', '2', '5', '10'],
};
