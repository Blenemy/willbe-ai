import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { AccountScenarioModel, HubspotToken, SavedAccount, SavedLead, User, LeadScenarioModel } from '@willbe-server/db-core';
import { InjectModel } from '@nestjs/sequelize';
import { Client as HubspotClient } from '@hubspot/api-client';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

export enum HubspotJob {
  START_WITH_ENRICH = 'start_with_enrich',
  LOAD_FROM_HUBSPOT = 'load_from_hubspot',
}

@Processor('hubspot-jobs')
export class HubspotProcessor extends WorkerHost {
  constructor(
    @InjectModel(HubspotToken)
    private readonly hubspotTokenModel: typeof HubspotToken,
    @InjectModel(SavedAccount)
    private readonly savedAccountModel: typeof SavedAccount,
    @InjectModel(SavedLead)
    private readonly savedLeadModel: typeof SavedLead,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job<any>) {
    if (job.name === HubspotJob.LOAD_FROM_HUBSPOT) {
      return await this.loadFromHubspot(job.data.companyId);
    }

    if (job.name === HubspotJob.START_WITH_ENRICH) {
      return await this.loadToHubspot(job.data.companyId);
    }

    return;
  }

  async loadFromHubspot(companyId: string) {
    const theCompaniesApiKey = this.configService.get('THE_COMPANIES_API_KEY');

    const hubspotToken = await this.hubspotTokenModel.findOne({
      where: {
        companyId,
      },
    });

    if (!hubspotToken) {
      return;
    }

    const hubspotClient = new HubspotClient({
      accessToken: hubspotToken.accessToken,
    });

    let hubspotCompanies = [];

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

    for (const hubspotCompany of hubspotCompanies) {
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

      const transformedCompanyData = this.transformCompanyData(companyData);
      savedAccount = await this.savedAccountModel.create({
        accountData: transformedCompanyData,
        accountScenarioId: null,
        companyId,
        isSyncedWithCrm: true,
      });

      if (!savedAccount) {
        console.error(`Failed to obtain a saved company record for HubSpot company ${hubspotCompany.id}. Skipping contacts.`);
        continue;
      }

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
            isSyncedWithCrm: true,
          });
        }

      } catch (contactFetchError) {
        console.error(`Error fetching contacts for company ${hubspotCompany.id}:`, contactFetchError);
      }
    }

    return hubspotCompanies;
  }

  async loadToHubspot(companyId: string) {
    const hubspotToken = await this.hubspotTokenModel.findOne({
      where: {
        companyId,
      },
    });

    if (!hubspotToken) {
      return;
    } 

    const hubspotClient = new HubspotClient({
      accessToken: hubspotToken.accessToken,
    });
    
    const savedAccounts = await this.savedAccountModel.findAll({
      include: [{
        model: AccountScenarioModel,
        include: [{
          model: User,
          where: {
            companyId,
          },
        }],
      }],
    });

    const chunkSize = 100;
    const accountChunks = [];
    for (let i = 0; i < savedAccounts.length; i += chunkSize) {
      const chunk = savedAccounts.slice(i, i + chunkSize);
      accountChunks.push(chunk);
    }

    for (const chunk of accountChunks) {
      const inputs = chunk.map((account) => ({
        properties: {
          name: account.accountData.name,
          city: account.accountData.location,
          website: account.accountData.profile_url,
        },
      }));

      const res = await this.safeHubspotCall(async () => {
        return await hubspotClient.crm.companies.batchApi.create({
          inputs,
        });
      }, hubspotToken.refreshToken);
    }

    let savedLeads = [];
    try {
      savedLeads = await this.savedLeadModel.findAll({
        include: [{
          model: LeadScenarioModel,
          include: [{
            model: User,
            where: {
              companyId,
            },
          }],
        }],
      });

      await Promise.all([
        this.savedAccountModel.update(
          { isSyncedWithCrm: true },
          { where: { id: savedAccounts.map(account => account.id) } }
        ),
        this.savedLeadModel.update(
          { isSyncedWithCrm: true },
          { where: { id: savedLeads.map(lead => lead.id) } }
        ),
      ]);
    } catch (error) {
      console.error(`Error fetching leads for company ${companyId}:`, error);
    }

    const leadChunks = [];
    for (let i = 0; i < savedLeads.length; i += chunkSize) {
      const chunk = savedLeads.slice(i, i + chunkSize);
      leadChunks.push(chunk);
    }

    for (const chunk of leadChunks) {
      const inputs = chunk.map((lead: SavedLead) => ({
        properties: {
          firstname: lead.leadData.first_name,
          lastname: lead.leadData.last_name,
          company: lead.leadData.name,
          jobtitle: lead.leadData.headline,
          industry: lead.leadData.industry || undefined,
        }
      }));

      const res = await this.safeHubspotCall(async () => {
          return await hubspotClient.crm.contacts.batchApi.create({
            inputs,
          });
      }, hubspotToken.refreshToken);
    }
    
    return;
  }


  transformCompanyData(companyData: any) {
    const formatIndustry = (industry) => {
        if (!industry) return null;
        return industry
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
    };
  
    const formatLocation = (
        city,
        state,
        country,
    ) => {
        const parts = [city, state, country].filter(part => part != null && part !== '');
        return parts.length > 0 ? parts.join(', ') : null;
    };
  
    const id = companyData.socials?.linkedin?.idNumeric ?? null;
    const logo = companyData.assets?.logoSquare?.src ?? null;
    const name = companyData.about?.name ?? null;
    const summary = companyData.descriptions?.primary ?? null;
    const industry = formatIndustry(companyData.about?.industry);
    const headcount = companyData.about?.totalEmployees ?? null;
    const profile_url = companyData.socials?.linkedin?.url ?? null;
  
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
        industry: industry,
        location: location,
        headcount: headcount,
        profile_url: profile_url,
    };
  
    return targetData;
  }

  transformContactData(contactData: any) {
      const props = contactData.properties ?? null;

      const firstName = props?.firstname ?? null;
      const lastName = props?.lastname ?? null;
      const jobTitle = props?.jobtitle ?? null;

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
      };
  
      return target;
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
}