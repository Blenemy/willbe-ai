import { z } from "zod";

export const leadSyncSchema = z.object({
  crmLeadFirstNameField: z.string().nullable(),
  crmLeadLastNameField: z.string().nullable(),
  crmLeadPositionField: z.string().nullable(),
  crmLeadPositionDescriptionField: z.string().nullable(),
  crmLeadEmailField: z.string().nullable(),
  crmLeadPhoneField: z.string().nullable(),
  crmLeadCompanyField: z.string().nullable(),
  crmLeadLanguageField: z.string().nullable(),
  crmLeadLocationCountryField: z.string().nullable(),
  crmLeadLocationCityField: z.string().nullable(),
  crmLeadSubtitleField: z.string().nullable(),
  crmLeadSummaryField: z.string().nullable(),
  crmLeadLinkedInField: z.string().nullable(),

  crmLeadNotContactedField: z.string().nullable(),
  crmLeadInCadenceField: z.string().nullable(),
  crmLeadResponseField: z.string().nullable(),
  crmLeadMeetingField: z.string().nullable(),
  crmLeadBouncedField: z.string().nullable(),
  crmLeadOutOfOfficeField: z.string().nullable(),
  crmLeadUnresponsiveField: z.string().nullable(),
});

export type LeadSyncSchema = z.infer<typeof leadSyncSchema>;

export const accountSyncSchema = z.object({
  crmAccountNameField: z.string().nullable(),
  crmAccountIndustryField: z.string().nullable(),
  crmAccountHeadquartersField: z.string().nullable(),
  crmAccountCityField: z.string().nullable(),
  crmAccountEmployeesField: z.string().nullable(),
  crmAccountWebsiteField: z.string().nullable(),
  crmAccountLinkedInField: z.string().nullable(),
});

export type AccountSyncSchema = z.infer<typeof accountSyncSchema>;
