export interface ICrmFieldsBinding {
  id: string;
  companyId: string;

  crmLeadFirstNameField: string;
  crmLeadLastNameField: string;
  crmLeadCompanyField: string;
  crmLeadJobTitleField: string;
  crmLeadIndustryField: string;
  crmLeadPositionField: string;
  crmLeadPositionDescriptionField: string;
  crmLeadEmailField: string;
  crmLeadPhoneField: string;
  crmLeadLanguageField: string;
  crmLeadLocationCountryField: string;
  crmLeadLocationCityField: string;
  crmLeadSubtitleField: string;
  crmLeadSummaryField: string;
  crmLeadLinkedInField: string;

  crmAccountNameField: string;
  crmAccountCityField: string;
  crmAccountWebsiteField: string;
  crmAccountCompanyTitleField: string;
  crmAccountFoundedInField: string;
  crmAccountHeadquartersField: string;
  crmAccountEmployeesField: string;
  crmAccountIndustryField: string;
  crmAccountLinkedInField: string;
  crmAccountDescriptionField: string;

  crmAccountNotContactedStatus: string;
  crmAccountInCadenceStatus: string;
  crmAccountResponseStatus: string;
  crmAccountMeetingStatus: string;
  crmAccountBouncedStatus: string;
  crmAccountOutOfOfficeStatus: string;
  crmAccountUnresponsiveStatus: string;

  crmLeadNotContactedStatus: string;
  crmLeadInCadenceStatus: string;
  crmLeadResponseStatus: string;
  crmLeadMeetingStatus: string;
  crmLeadBouncedStatus: string;
  crmLeadOutOfOfficeStatus: string;
  crmLeadUnresponsiveStatus: string;

  createdAt: Date;
  updatedAt: Date;
}

