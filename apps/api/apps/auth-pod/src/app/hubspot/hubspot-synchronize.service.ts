import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountScenarioModel, Company, CrmFieldsBinding, HubspotToken, LeadScenarioModel, SavedAccount, SavedLead } from '@willbe-server/db-core';
import { InjectModel } from '@nestjs/sequelize';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Client as HubspotClient } from '@hubspot/api-client';
import { inspect } from 'node:util';
import { Op } from 'sequelize';
import { HubspotFieldsBindingService } from './hubspot-fields-binding.service';
import { UpdateAutoSyncReq } from './dto/sync-dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import Fuse from 'fuse.js';
import { hubspotIndustries } from './constants/hubspot-industries';

@Injectable()
export class HubspotSynchronizeService {
  private fuse: Fuse<string>;

  constructor(
    @InjectModel(HubspotToken)
    private readonly hubspotTokenModel: typeof HubspotToken,
    @InjectModel(SavedAccount)
    private readonly savedAccountModel: typeof SavedAccount,
    @InjectModel(SavedLead)
    private readonly savedLeadModel: typeof SavedLead,
    @InjectModel(Company)
    private readonly companyModel: typeof Company,
    @InjectModel(CrmFieldsBinding)
    private readonly crmFieldsBindingModel: typeof CrmFieldsBinding,
    @InjectModel(AccountScenarioModel)
    private readonly accountScenarioModel: typeof AccountScenarioModel,
    @InjectModel(LeadScenarioModel)
    private readonly leadScenarioModel: typeof LeadScenarioModel,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly hubspotFieldsBindingService: HubspotFieldsBindingService,
  ) {
    this.fuse = new Fuse(hubspotIndustries, {
      includeScore: true,
      threshold: 0.3,
    });
  }
  
  mapIndustryToHubSpot(input?: string) {
    if (!input) {
      return null;
    }
    const result = this.fuse.search(input.trim());
    if (result.length > 0) {
      return result[0].item;
    }
    return null;
  }

  async startWithEnrich(companyId: string) {
    console.log('startWithEnrich');
    return;
  }

  async initialSync(
    companyId: string,
    withEnrich: boolean,
  ) {
    const theCompaniesApiKey = this.configService.get('THE_COMPANIES_API_KEY');
    const hubspotToken = await this.hubspotTokenModel.findOne({
      where: {
        companyId,
      },
    });

    if (!hubspotToken) {
      throw new BadRequestException('HubSpot connection not found');
    }

    const hubspotClient = new HubspotClient({
      accessToken: hubspotToken.accessToken,
    });

    let hubspotCompanies = [];
    const hubspotCompaniesIds = [];

    try {
      const companySearchRequest = {
        properties: ["name", "domain", "phone", "city", "website"],
        limit: 100,
        after: undefined,
      };
      let hasMoreCompanies = true;
      while(hasMoreCompanies) {
        const companyResult = await this.safeHubspotCall(async () => {
          return await hubspotClient.crm.companies.searchApi.doSearch(companySearchRequest);
        }, hubspotToken.refreshToken);

        hubspotCompanies.push(...companyResult.results);
        hubspotCompaniesIds.push(...companyResult.results.map((result) => result.id))
        if (companyResult.paging?.next?.after) {
          companySearchRequest.after = companyResult.paging.next.after;
        } else {
          hasMoreCompanies = false;
        }
      }
    } catch (error) {
      console.error(`Error fetching companies from HubSpot for company ${companyId}:`, error);
      return;
    }

    const existingAccounts = await this.savedAccountModel.findAll({
      where: {
        companyId: companyId,
        hubspotCompanyId: { [Op.in]: hubspotCompaniesIds },
      },
      attributes: ['hubspotCompanyId'],
    });
    const existingHubspotCompanyIds = new Set(existingAccounts.map(acc => acc.hubspotCompanyId));

    const newHubspotCompanies = hubspotCompanies.filter(company => !existingHubspotCompanyIds.has(company.id));

    const createdAccountIds = [];
    const createdLeadIds = [];

    for (const hubspotCompany of newHubspotCompanies) {
      let savedAccount: SavedAccount | null = null;

      let companyData = null;

      try {
        const companyDataRes = await firstValueFrom(
          this.httpService.get(
            `https://api.thecompaniesapi.com/v2/companies/${hubspotCompany.properties?.domain}`,
            {
              headers: {
                'Authorization': `Basic ${theCompaniesApiKey}`,
              },
            },
          ),
        );

        companyData = companyDataRes.data;
      } catch (error) {
        console.error(`Error fetching company data for ${hubspotCompany.properties?.domain}`);
        continue;
      }

      const transformedCompanyData = this.transformCompanyData({
        ...companyData,
        domain: hubspotCompany.properties?.domain,
      });

      savedAccount = await this.savedAccountModel.create({
        accountData: transformedCompanyData,
        accountScenarioId: null,
        companyId,
        hubspotCompanyId: hubspotCompany.id,
        isSyncedWithCrm: true,
      });

      if (!savedAccount) {
        console.error(`Failed to obtain a saved company record for HubSpot company ${hubspotCompany.id}. Skipping contacts.`);
        continue;
      }

      createdAccountIds.push(savedAccount.id);

      try {
        const contactSearchRequest = {
          filterGroups: [{
            filters: [{
              propertyName: 'associations.company',
              operator: 'EQ' as any,
              value: hubspotCompany.id
            }]
          }],
          properties: ['firstname', 'lastname', 'email', 'phone', 'jobtitle'],
          limit: 100,
          after: undefined,
        };

        let hubspotContacts = [];
        let hasMoreContacts = true;
        while(hasMoreContacts) {
          const contactsResponse = await this.safeHubspotCall(async () => {
            return await hubspotClient.crm.contacts.searchApi.doSearch(contactSearchRequest);
          }, hubspotToken.refreshToken);

          hubspotContacts.push(...contactsResponse.results);
          if (contactsResponse.paging?.next?.after) {
            contactSearchRequest.after = contactsResponse.paging.next.after;
          } else {
            hasMoreContacts = false;
          }
        }

        for (const hubspotContact of hubspotContacts) {
          const transformedContactData = this.transformContactData(hubspotContact);
          const savedLead = await this.savedLeadModel.create({
            leadData: transformedContactData,
            leadScenarioId: null,
            companyId,
            accountId: savedAccount.id,
            isSyncedWithCrm: true,
            hubspotContactId: hubspotContact.id,
          });

          createdLeadIds.push(savedLead.id);
        }

      } catch (contactFetchError) {
        console.error(`Error fetching contacts for company ${hubspotCompany.id}:`, contactFetchError);
      }
    }

    if (withEnrich) {
      await this.syncAccounts(createdAccountIds, companyId);
    }

    return {
      result: 'Hubspot sync without enrich started',
    };
  }

  private async safeHubspotCall<T>(fn: () => Promise<T>, refreshToken: string) {
    for (let i = 0; i <= 1; i++) {
      try {
        const data = await fn();
        return data;
      } catch (error) {
        if (error.code === 401) {
          const payload = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: process.env.HUBSPOT_CLIENT_ID,
            client_secret: process.env.HUBSPOT_CLIENT_SECRET,
            refresh_token: refreshToken,
          });
        
          const res = await firstValueFrom(
            this.httpService.post('https://api.hubapi.com/oauth/v1/token', payload.toString(), {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }),
          );
      
          const { access_token, refresh_token, expires_in } = res.data;
    
          await this.hubspotTokenModel.update({
            accessToken: access_token,
            refreshToken: refresh_token,
          }, {
            where: {
              refreshToken,
            },
          });
        }
      }
    }
  }

  transformContactData(contactData: any) {
    const props = contactData.properties ?? null;

    const firstName = props?.firstname ?? null;
    const lastName = props?.lastname ?? null;
    const jobTitle = props?.jobtitle ?? null;
    const email = props?.email ?? null;
    
    let fullName = null;
    if (firstName && lastName) {
        fullName = `${firstName} ${lastName}`;
    } else if (firstName) {
        fullName = firstName;
    } else if (lastName) {
        fullName = lastName;
    }

    const headline = jobTitle;

    let currentPositions = null;
    if (jobTitle) {
      currentPositions = [
        {
          role: jobTitle,
          company: null,
          industry: null,
          location: null,
          company_id: null,
          tenure_at_role: null,
          tenure_at_company: null,
        },
      ];
    }

    const target = {
      id: null,
      name: fullName,
      type: 'PEOPLE',
      premium: null,
      summary: null,
      headline,
      industry: null,
      location: null,
      last_name: lastName,
      first_name: firstName,
      member_urn: null,
      profile_url: null,
      open_profile: null,
      network_distance: null,
      current_positions: currentPositions,
      public_identifier: null,
      pending_invitation: null,
      public_profile_url: null,
      recent_posts_count: null,
      profile_picture_url: null,
      profile_picture_url_large: null,
      email,
    };

    return target;
  }

  transformCompanyData(companyData: any) {
    const formatIndustryForHubspot = (industryLabel: string | null | undefined): string | null => {
      if (!industryLabel) {
        return null;
      }

      const hubspotIndustry = this.mapIndustryToHubSpot(industryLabel);
      if (!hubspotIndustry) {
        return null;
      }

      return hubspotIndustry
        .trim()
        .toUpperCase()
        .replace(/[\s/&-]+/g, '_');
    };
  
    const formatLocation = (
      city,
      state,
      country,
    ) => {
      const parts = [city, state, country].filter(part => part != null && part !== '');
      return parts.length > 0 ? parts.join(', ') : null;
    };
  
    const id = companyData.socials?.linkedin?.idNumeric
      ?? companyData.socials?.linkedin?.id
      ?? null;
    const logo = companyData.assets?.logoSquare?.src ?? null;
    const name = companyData.about?.name ?? null;
    const summary = companyData.descriptions?.primary ?? null;
    const industry = formatIndustryForHubspot(companyData.about?.industry);
    const headcount = companyData.about?.totalEmployeesExact ?? null;
    const founded_year = companyData.about?.yearFounded ?? null;
    const headquarters = companyData.locations?.headquarters?.country?.code?.toUpperCase();
    const profile_url = companyData.socials?.linkedin?.url ?? null;
    const website = companyData?.domain ?? null;
    const sales_navigator_url = companyData.urls?.salesNavigator ?? null;
  
    const city = companyData.locations?.headquarters?.city?.name;
    const state = companyData.locations?.headquarters?.state?.name;
    const country = companyData.locations?.headquarters?.country?.name;
    const location = formatLocation(city, state, country);
  
    const targetData = {
        id: id,
        logo: logo,
        name: name,
        type: 'COMPANY',
        summary: summary,
        founded_year: founded_year,
        location: location,
        headcount: headcount,
        headquarters: headquarters,
        profile_url: profile_url,
        website: website,
        sales_navigator_url: sales_navigator_url,
    };

    if (industry) {
      targetData['industry'] = industry;
    }
  
    return targetData;
  }

  async syncAccounts(
    accountIds: string[],
    companyId: string,
  ) {
    const savedAccounts = await this.savedAccountModel.findAll({
      where: {
        id: {
          [Op.in]: accountIds,
        },
      },
    });

    const hubspotToken = await this.hubspotTokenModel.findOne({
      where: {
        companyId,
      },
    }); 

    if (!hubspotToken) {
      throw new BadRequestException('HubSpot connection not found');
    }

    const hubspotFieldsBinding = await this.crmFieldsBindingModel.findOne({
      where: {
        companyId,
      },
    });

    if (!hubspotFieldsBinding) {
      throw new BadRequestException('HubSpot fields binding not found');
    }

    const hubspotClient = new HubspotClient({
      accessToken: hubspotToken.accessToken,
    });

    const updates = [];
    const notExistingAccountsInHubspot = [];

    for (const savedAccount of savedAccounts) {
      const hubspotCompany = await this.safeHubspotCall(async () => {
        return await hubspotClient.crm.companies.basicApi.getById(savedAccount.hubspotCompanyId);
      }, hubspotToken.refreshToken);

      if (!hubspotCompany) {
        notExistingAccountsInHubspot.push(savedAccount)
        continue;
      }

      const propertiesToUpdate = this.hubspotFieldsBindingService.buildAccountsFieldsForUpdate(
        hubspotFieldsBinding,
        savedAccount,
        hubspotCompany,
      );

      if (Object.keys(propertiesToUpdate).length > 0) {
        updates.push({
          id: hubspotCompany.id,
          properties: propertiesToUpdate,
        });
      }
    }

    // Batch update in HubSpot if there are updates
    if (updates.length > 0) {
      const formatedUpdates = updates.map(update => ({
        ...update,
        properties: Object.fromEntries(
          Object.entries(update.properties).map(([k, v]) => [k, v != null ? String(v) : ''])
        ),
      }));
      const enrichdata = await this.safeHubspotCall(async () => {
        const enrichresult = await hubspotClient.crm.companies.batchApi.update({ inputs: formatedUpdates });
        return enrichresult;
      }, hubspotToken.refreshToken);
      // Set isSyncedWithCrm to true for updated accounts
      const updatedAccountIds = savedAccounts
        .filter((savedAccount) =>
          updates.some((u) => u.id === savedAccount.hubspotCompanyId)
        )
        .map((acc) => acc.id);
      if (updatedAccountIds.length > 0) {
        await this.savedAccountModel.update(
          { isSyncedWithCrm: true },
          {
            where: { id: { [Op.in]: updatedAccountIds } },
            hooks: false,
          }
        );
      }
    }

    if (notExistingAccountsInHubspot.length) {
      const accountsToCreate = notExistingAccountsInHubspot.map((savedAccount) => {
        return {
          properties: this.hubspotFieldsBindingService.buildAccountsFieldsForCreate(hubspotFieldsBinding, savedAccount),
        };
      });

      if (accountsToCreate.length > 0) {
        const createResponse = await this.safeHubspotCall(async () => {
          return await hubspotClient.crm.companies.batchApi.create({ inputs: accountsToCreate });
        }, hubspotToken.refreshToken);

        createResponse.results.forEach(async (created, index) => {
          const localId = notExistingAccountsInHubspot[index].id;
          await this.savedAccountModel.update(
            { hubspotCompanyId: created.id, isSyncedWithCrm: true },
            { where: { id: localId }, hooks: false }
          );
        });
      }
    }

    return {
      result: 'HubSpot companies enriched and updated',
      updated: updates.length,
      created: notExistingAccountsInHubspot.length,
    };
  }

  async syncLeads(
    leadIds: string[],
    companyId: string,
  ) {
    const savedLeads = await this.savedLeadModel.findAll({
      where: {
        id: {
          [Op.in]: leadIds,
        },
      },
    });

    const hubspotToken = await this.hubspotTokenModel.findOne({
      where: {
        companyId,
      },
    });

    if (!hubspotToken) {
      throw new BadRequestException('HubSpot connection not found');
    }

    const hubspotFieldsBinding = await this.crmFieldsBindingModel.findOne({
      where: {
        companyId,
      },
    });

    if (!hubspotFieldsBinding) {
      throw new BadRequestException('HubSpot fields binding not found');
    }

    const hubspotClient = new HubspotClient({
      accessToken: hubspotToken.accessToken,
    });
    
    const updates = [];
    const notExistingLeadsInHubspot = [];

    for (const savedLead of savedLeads) {
      const hubspotContact = await this.safeHubspotCall(async () => {
        return await hubspotClient.crm.contacts.basicApi.getById(savedLead.hubspotContactId);
      }, hubspotToken.refreshToken);

      if (!hubspotContact) {
        notExistingLeadsInHubspot.push(savedLead);
        continue;
      }

      const propertiesToUpdate = this.hubspotFieldsBindingService.buildLeadsFieldsForUpdate(
        hubspotFieldsBinding,
        savedLead,
        hubspotContact,
      );

      if (Object.keys(propertiesToUpdate).length > 0) {
        updates.push({
          id: hubspotContact.id,
          properties: propertiesToUpdate,
        });
      }
    }

    if (updates.length > 0) {
      await this.safeHubspotCall(async () => {
        return await hubspotClient.crm.contacts.batchApi.update({ inputs: updates });
      }, hubspotToken.refreshToken);
      // Set isSyncedWithCrm to true for updated leads
      const updatedLeadIds = savedLeads
        .filter((savedLead) =>
          updates.some((u) => u.id === savedLead.hubspotContactId)
        )
        .map((lead) => lead.id);
      if (updatedLeadIds.length > 0) {
        await this.savedLeadModel.update(
          { isSyncedWithCrm: true },
          {
            where: { id: { [Op.in]: updatedLeadIds } },
            hooks: false,
          }
        );
      }
    }

    if (notExistingLeadsInHubspot.length) {
      // TODO: associations
      const leadsToCreate = notExistingLeadsInHubspot.map((savedLead) => {
        return {
          properties: this.hubspotFieldsBindingService.buildLeadsFieldsForCreate(hubspotFieldsBinding, savedLead),
        };
      });

      if (leadsToCreate.length > 0) {
        const createResponse = await this.safeHubspotCall(async () => {
          return await hubspotClient.crm.contacts.batchApi.create({ inputs: leadsToCreate });
        }, hubspotToken.refreshToken);

        createResponse.results.forEach(async (created, index) => {
          const localId = notExistingLeadsInHubspot[index].id;
          await this.savedLeadModel.update(
            { hubspotContactId: created.id, isSyncedWithCrm: true },
            { where: { id: localId }, hooks: false }
          );
        });
      }
    }

    return {
      result: 'HubSpot contacts enriched and updated',
      updated: updates.length,
      created: notExistingLeadsInHubspot.length
    };
  }

  @Cron(CronExpression.EVERY_4_HOURS)
  async autoSync() {
    const companiesWithAutoSync = await this.companyModel.findAll({
      where: {
        autoSyncCrm: true,
      }
    });

    for (const company of companiesWithAutoSync) {
      const unsyncedAccouts = await this.savedAccountModel.findAll({
        where: {
          isSyncedWithCrm: false,
        },
        attributes: ['id'],
      });
      const unsyncedAccoutsIds = unsyncedAccouts.map(account => account.id);
    
      console.log('unsyncedAccouts');
      console.log(unsyncedAccoutsIds);

      await this.syncAccounts(unsyncedAccoutsIds, company.id);

      const unsyncedLeads = await this.savedLeadModel.findAll({
        where: {
          isSyncedWithCrm: false,
        },
        attributes: ['id'],
      });
      const unsyncedLeadsIds = unsyncedLeads.map(lead => lead.id);

      console.log('unsyncedLeadsIds');
      console.log(unsyncedLeadsIds);

      await this.syncLeads(unsyncedLeadsIds, company.id);
    }
  }

  async updateAutoSync(dto: UpdateAutoSyncReq, companyId: string) {
    const updateCompanyResult = await this.companyModel.update({
      autoSyncCrm: dto.isAutoSync,
    }, {
      where: {
        id: companyId,
      },
      returning: true,
    });

    const result = updateCompanyResult[1][0].autoSyncCrm
      ? 'Hubspot auto sync enabled'
      : 'Hubspot auto sync disabled';

    return { result };
  }
}
