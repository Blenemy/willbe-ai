import 'reflect-metadata';
import { CompanyProduct } from './company-services.model';
import { Company } from './company.model';
import { EmailServiceTokens } from './email-service-tokens.model';
import { EmailSignature } from './email-signature.model';
import { Invitation } from './invitation.model';
import { LeadScenarioFilterValueModel } from './lead-scenario-filter-value.model';
import { LeadScenarioFilterModel } from './lead-scenario-filter.model';
import { LeadScenarioModel } from './lead-scenario.model';
import { ResetPasswordRequest } from './reset-password-request.model';
import { SavedLead } from './saved-lead.model';
import { User } from './user.model';
import { AccountScenarioModel } from './account-scenario.model';
import { AccountScenariosFilterValueModel } from './account-scenarios-filter-value.model';
import { UserLinkedinAccount } from './user-linkedin-account.model';
import { SavedAccount } from './saved-account.model';
import { MessageStructure } from './message-structure.model';
import { MessageTemplate } from './message-template.model';
import { MessageScenario } from './message-scenario.model';
import { MessageScenarioLead } from './message-scenario-lead.model';
import { MessageEntry } from './message-entry.model';
import { MessageEntryLeadData } from './message-entry-lead-data.model';
import { SentEmailMessage } from './sent-message.model';
import { OutlookSubscription } from './outlook-subscription.model';
import { ReceivedMessage } from './received-message.model';
import { HubspotToken } from './hubspot-token.model';
import { CrmFieldsBinding } from './crm-fields-bnding.model';
import { SearchLeadsResult } from './search-leads-result.model';
import { SearchAccountsResult } from './search-accounts-result.model';

export const baseModels = [
  User,
  Company,
  CompanyProduct,
  Invitation,
  ResetPasswordRequest,
  EmailSignature,
  EmailServiceTokens,
  UserLinkedinAccount,
  LeadScenarioModel,
  LeadScenarioFilterModel,
  LeadScenarioFilterValueModel,
  SavedLead,
  SavedAccount,
  AccountScenarioModel,
  AccountScenariosFilterValueModel,
  MessageStructure,
  MessageTemplate,
  MessageScenario,
  MessageScenarioLead,
  MessageEntry,
  MessageEntryLeadData,
  SentEmailMessage,
  OutlookSubscription,
  ReceivedMessage,
  HubspotToken,
  CrmFieldsBinding,
  SearchLeadsResult,
  SearchAccountsResult,
];
