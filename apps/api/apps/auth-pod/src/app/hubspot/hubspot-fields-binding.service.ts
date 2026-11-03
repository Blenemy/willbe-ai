import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CrmFieldsBinding, SavedAccount, SavedLead } from '@willbe-server/db-core';

@Injectable()
export class HubspotFieldsBindingService {
  constructor(
    @InjectModel(CrmFieldsBinding)
    private readonly crmFieldsBindingModel: typeof CrmFieldsBinding,
  ) {}

  buildAccountsFieldsForUpdate(
    fieldsBinding: CrmFieldsBinding,
    updatedAccount: SavedAccount,
    hubspotAccouontToUpdate: any,
  ) {
    console.log('updatedAccount');
    console.log(updatedAccount)
    console.log('hubspotAccouontToUpdate');
    console.log(hubspotAccouontToUpdate)

    const propertiesToUpdate: any = {};
    if (
      fieldsBinding?.crmAccountNameField &&
      updatedAccount.accountData?.name &&
      updatedAccount.accountData.name !== hubspotAccouontToUpdate.properties[fieldsBinding.crmAccountNameField]
    ) {
      propertiesToUpdate[fieldsBinding.crmAccountNameField] = updatedAccount.accountData.name;
    }

    if (
      fieldsBinding?.crmAccountCityField &&
      updatedAccount.accountData?.location &&
      updatedAccount.accountData.location !== hubspotAccouontToUpdate.properties[fieldsBinding.crmAccountCityField]
    ) {
      propertiesToUpdate[fieldsBinding.crmAccountCityField] = updatedAccount.accountData.location;
    }

    if (
      fieldsBinding?.crmAccountWebsiteField &&
      updatedAccount.accountData?.profile_url &&
      updatedAccount.accountData.profile_url !== hubspotAccouontToUpdate.properties[fieldsBinding.crmAccountWebsiteField]
    ) {
      propertiesToUpdate[fieldsBinding.crmAccountWebsiteField] = updatedAccount.accountData.profile_url;
    }

    if (
      fieldsBinding?.crmAccountHeadquartersField &&
      updatedAccount.accountData?.location &&
      updatedAccount.accountData.location !== hubspotAccouontToUpdate.properties[fieldsBinding.crmAccountCityField]
    ) {
      propertiesToUpdate[fieldsBinding.crmAccountHeadquartersField] = updatedAccount.accountData.location;
    }

    if (
      fieldsBinding?.crmAccountEmployeesField &&
      updatedAccount.accountData?.headcount &&
      updatedAccount.accountData.headcount !== hubspotAccouontToUpdate.properties[fieldsBinding.crmAccountEmployeesField]
    ) {
      propertiesToUpdate[fieldsBinding.crmAccountEmployeesField] = updatedAccount.accountData.headcount;
    }

    if (
      fieldsBinding?.crmAccountIndustryField &&
      updatedAccount.accountData?.industry &&
      updatedAccount.accountData.industry !== hubspotAccouontToUpdate.properties[fieldsBinding.crmAccountIndustryField]
    ) {
      propertiesToUpdate[fieldsBinding.crmAccountIndustryField] = updatedAccount.accountData.industry;
    }

    if (
      fieldsBinding?.crmAccountLinkedInField &&
      updatedAccount.accountData?.profile_url &&
      updatedAccount.accountData.profile_url !== hubspotAccouontToUpdate.properties[fieldsBinding.crmAccountWebsiteField]
    ) {
      propertiesToUpdate[fieldsBinding.crmAccountLinkedInField] = updatedAccount.accountData.profile_url;
    }

    if (
      fieldsBinding?.crmAccountDescriptionField &&
      updatedAccount.accountData.summary &&
      updatedAccount.accountData.summary !== hubspotAccouontToUpdate[fieldsBinding.crmAccountDescriptionField]
    ) {
      propertiesToUpdate[fieldsBinding.crmAccountDescriptionField] = updatedAccount.accountData.summary;
    }

    console.log('propertiesToUpdate');
    console.log(propertiesToUpdate);

    return propertiesToUpdate;
  }

  buildLeadsFieldsForUpdate(
    fieldsBinding: CrmFieldsBinding,
    updatedLead: SavedLead,
    hubspotLeadToUpdate: any,
  ) {
    const propertiesToUpdate: any = {};

    if (
      fieldsBinding?.crmLeadFirstNameField &&
      updatedLead.leadData?.first_name &&
      updatedLead.leadData.first_name !== hubspotLeadToUpdate.properties[fieldsBinding.crmLeadFirstNameField]
    ) {
      propertiesToUpdate[fieldsBinding.crmLeadFirstNameField] = updatedLead.leadData.first_name;
    }

    if (
      fieldsBinding?.crmLeadLastNameField &&
      updatedLead.leadData?.last_name &&
      updatedLead.leadData.last_name !== hubspotLeadToUpdate.properties[fieldsBinding.crmLeadLastNameField]
    ) {
      propertiesToUpdate[fieldsBinding.crmLeadLastNameField] = updatedLead.leadData.last_name;
    }

    if (
      fieldsBinding?.crmLeadCompanyField
    ) {
      // TODO: company
    }

    if (
      fieldsBinding?.crmLeadJobTitleField &&
      updatedLead.leadData?.headline &&
      updatedLead.leadData.headline !== hubspotLeadToUpdate.properties[fieldsBinding.crmLeadJobTitleField]
    ) {
      propertiesToUpdate[fieldsBinding.crmLeadJobTitleField] = updatedLead.leadData.headline;
    }

    if (
      fieldsBinding?.crmLeadIndustryField &&
      updatedLead.leadData?.industry &&
      updatedLead.leadData.industry !== hubspotLeadToUpdate.properties[fieldsBinding.crmLeadIndustryField]
    ) {
      propertiesToUpdate[fieldsBinding.crmLeadIndustryField] = updatedLead.leadData.industry;
    }

    if (
      fieldsBinding?.crmLeadPositionField &&
      updatedLead.leadData?.current_positions?.[0]?.role &&
      updatedLead.leadData.current_positions[0].role !== hubspotLeadToUpdate.properties[fieldsBinding.crmLeadPositionField]
    ) {
      propertiesToUpdate[fieldsBinding.crmLeadPositionField] = updatedLead.leadData.current_positions;
    }

    if (
      fieldsBinding?.crmLeadPositionDescriptionField &&
      updatedLead.leadData?.position_description &&
      updatedLead.leadData.position_description !== hubspotLeadToUpdate.properties[fieldsBinding.crmLeadPositionDescriptionField]
    ) {
      propertiesToUpdate[fieldsBinding.crmLeadPositionDescriptionField] = updatedLead.leadData.position_description;
    }

    if (
      fieldsBinding?.crmLeadEmailField &&
      updatedLead.leadData?.email &&
      updatedLead.leadData.email !== hubspotLeadToUpdate.properties[fieldsBinding.crmLeadEmailField]
    ) {
      propertiesToUpdate[fieldsBinding.crmLeadEmailField] = updatedLead.leadData.email;
    }

    if (
      fieldsBinding?.crmLeadPhoneField &&
      updatedLead.leadData?.phone &&
      updatedLead.leadData.phone !== hubspotLeadToUpdate.properties[fieldsBinding.crmLeadPhoneField]
    ) {
      propertiesToUpdate[fieldsBinding.crmLeadPhoneField] = updatedLead.leadData.phone;
    }

    if (
      fieldsBinding?.crmLeadLanguageField &&
      updatedLead.leadData?.language &&
      updatedLead.leadData.language !== hubspotLeadToUpdate.properties[fieldsBinding.crmLeadLanguageField]
    ) {
      propertiesToUpdate[fieldsBinding.crmLeadLanguageField] = updatedLead.leadData.language;
    }

    if (
      fieldsBinding?.crmLeadLocationCountryField &&
      updatedLead.leadData?.location_country &&
      updatedLead.leadData.location_country !== hubspotLeadToUpdate.properties[fieldsBinding.crmLeadLanguageField]
    ) {
      propertiesToUpdate[fieldsBinding.crmLeadLocationCountryField] = updatedLead.leadData.location_country;
    }

    if (
      fieldsBinding?.crmLeadLocationCityField &&
      updatedLead.leadData?.location_city &&
      updatedLead.leadData.location_city !== hubspotLeadToUpdate.properties[fieldsBinding.crmLeadLocationCityField]
    ) {
      propertiesToUpdate[fieldsBinding.crmLeadLocationCityField] = updatedLead.leadData.location_city;
    }

    if (
      fieldsBinding?.crmLeadSubtitleField &&
      updatedLead.leadData?.headline &&
      updatedLead.leadData.headline !== hubspotLeadToUpdate.properties[fieldsBinding.crmLeadSubtitleField]
    ) {
      propertiesToUpdate[fieldsBinding.crmLeadSubtitleField] = updatedLead.leadData.headline;
    }

    if (
      fieldsBinding?.crmLeadSummaryField &&
      updatedLead.leadData?.summary &&
      updatedLead.leadData.summary !== hubspotLeadToUpdate.properties[fieldsBinding.crmLeadSummaryField]
    ) {
      propertiesToUpdate[fieldsBinding.crmLeadSummaryField] = updatedLead.leadData.summary;
    }

    if (
      fieldsBinding?.crmLeadLinkedInField &&
      updatedLead.leadData?.profile_url &&
      updatedLead.leadData.profile_url !== hubspotLeadToUpdate.properties[fieldsBinding.crmLeadLinkedInField]
    ) {
      propertiesToUpdate[fieldsBinding.crmLeadLinkedInField] = updatedLead.leadData.profile_url;
    }

    console.log('propertiesToUpdate');
    console.log(propertiesToUpdate);

    return propertiesToUpdate;
  }

  buildAccountsFieldsForCreate(
    fieldsBinding: CrmFieldsBinding,
    createdAccount: SavedAccount,
  ) {
    const propertiesToCreate: any = {};
    if (
      fieldsBinding?.crmAccountNameField &&
      createdAccount.accountData.name
    ) {
      propertiesToCreate[fieldsBinding.crmAccountNameField] = createdAccount.accountData.name;
    }

    if (
      fieldsBinding?.crmAccountCityField &&
      createdAccount.accountData?.location
    ) {
      propertiesToCreate[fieldsBinding.crmAccountCityField] = createdAccount.accountData.location;
    }

    if (
      fieldsBinding?.crmAccountWebsiteField &&
      createdAccount.accountData?.profile_url
    ) {
      propertiesToCreate[fieldsBinding.crmAccountWebsiteField] = createdAccount.accountData.profile_url;
    }

    if (
      fieldsBinding?.crmAccountHeadquartersField &&
      createdAccount.accountData?.location
    ) {
      propertiesToCreate[fieldsBinding.crmAccountHeadquartersField] = createdAccount.accountData.location;
    }

    if (
      fieldsBinding?.crmAccountEmployeesField &&
      createdAccount.accountData?.headcount
    ) {
      propertiesToCreate[fieldsBinding.crmAccountEmployeesField] = createdAccount.accountData.headcount;
    }

    if (
      fieldsBinding?.crmAccountIndustryField &&
      createdAccount.accountData?.industry
    ) {
      propertiesToCreate[fieldsBinding.crmAccountIndustryField] = createdAccount.accountData.industry;
    }

    if (
      fieldsBinding?.crmAccountLinkedInField &&
      createdAccount.accountData?.profile_url
    ) {
      propertiesToCreate[fieldsBinding.crmAccountLinkedInField] = createdAccount.accountData.profile_url;
    }

    if (
      fieldsBinding?.crmAccountDescriptionField &&
      createdAccount.accountData.summary
    ) {
      propertiesToCreate[fieldsBinding.crmAccountDescriptionField] = createdAccount.accountData.summary;
    }

    console.log('propertiesToCreate');
    console.log(propertiesToCreate);

    return propertiesToCreate;
  }

  buildLeadsFieldsForCreate(
    fieldsBinding: CrmFieldsBinding,
    createdLead: SavedLead,
  ) {
    const propertiesToCreate: any = {};

    if (
      fieldsBinding?.crmLeadFirstNameField &&
      createdLead.leadData.first_name
    ) {
      propertiesToCreate[fieldsBinding.crmLeadFirstNameField] = createdLead.leadData.first_name;
    }

    if (
      fieldsBinding?.crmLeadLastNameField &&
      createdLead.leadData?.last_name
    ) {
      propertiesToCreate[fieldsBinding.crmLeadLastNameField] = createdLead.leadData.last_name;
    }

    if (
      fieldsBinding?.crmLeadCompanyField
    ) {
      // TODO: company
    }

    if (
      fieldsBinding?.crmLeadJobTitleField &&
      createdLead.leadData?.headline 
    ) {
      propertiesToCreate[fieldsBinding.crmLeadJobTitleField] = createdLead.leadData.headline;
    }

    if (
      fieldsBinding?.crmLeadIndustryField &&
      createdLead.leadData?.industry
    ) {
      propertiesToCreate[fieldsBinding.crmLeadIndustryField] = createdLead.leadData.industry;
    }

    if (
      fieldsBinding?.crmLeadPositionField &&
      createdLead.leadData?.current_positions?.[0]?.role
    ) {
      propertiesToCreate[fieldsBinding.crmLeadPositionField] = createdLead.leadData.current_positions[0].role;
    }

    if (
      fieldsBinding?.crmLeadPositionDescriptionField &&
      createdLead.leadData?.position_description
    ) {
      propertiesToCreate[fieldsBinding.crmLeadPositionDescriptionField] = createdLead.leadData.position_description;
    }

    if (
      fieldsBinding?.crmLeadEmailField &&
      createdLead.leadData?.email
    ) {
      propertiesToCreate[fieldsBinding.crmLeadEmailField] = createdLead.leadData.email;
    }

    if (
      fieldsBinding?.crmLeadPhoneField &&
      createdLead.leadData?.phone
    ) {
      propertiesToCreate[fieldsBinding.crmLeadPhoneField] = createdLead.leadData.phone;
    }

    if (
      fieldsBinding?.crmLeadLanguageField &&
      createdLead.leadData?.language
    ) {
      propertiesToCreate[fieldsBinding.crmLeadLanguageField] = createdLead.leadData.language;
    }

    if (
      fieldsBinding?.crmLeadLocationCountryField &&
      createdLead.leadData?.location_country
    ) {
      propertiesToCreate[fieldsBinding.crmLeadLocationCountryField] = createdLead.leadData.location_country;
    }

    if (
      fieldsBinding?.crmLeadLocationCityField &&
      createdLead.leadData?.location_city
    ) {
      propertiesToCreate[fieldsBinding.crmLeadLocationCityField] = createdLead.leadData.location_city;
    }

    if (
      fieldsBinding?.crmLeadSubtitleField &&
      createdLead.leadData?.headline
    ) {
      propertiesToCreate[fieldsBinding.crmLeadSubtitleField] = createdLead.leadData.headline;
    }

    if (
      fieldsBinding?.crmLeadSummaryField &&
      createdLead.leadData?.summary
    ) {
      propertiesToCreate[fieldsBinding.crmLeadSummaryField] = createdLead.leadData.summary;
    }

    if (
      fieldsBinding?.crmLeadLinkedInField &&
      createdLead.leadData?.profile_url
    ) {
      propertiesToCreate[fieldsBinding.crmLeadLinkedInField] = createdLead.leadData.profile_url;
    }

    console.log('propertiesToCreate');
    console.log(propertiesToCreate);

    return propertiesToCreate;
  }
}
