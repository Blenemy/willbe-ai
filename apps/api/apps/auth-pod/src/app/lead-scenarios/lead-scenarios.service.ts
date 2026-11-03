import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  LeadScenarioModel,
  User,
  LeadScenarioFilterModel,
  LeadScenarioFilterValueModel,
  LeadScenarioFilterKey,
  SavedLead,
  FindLeadsRes,
  SavedAccount,
  SearchLeadsResult,
} from '@willbe-server/db-core';
import { CreateLeadScenarioReq } from './dto/create-lead-scenario.dto';
import { UpdateLeadScenarioReq } from './dto/update-lead-scenario.dto';
import { LeadScenariosFiltersService } from './lead-scenarios-filters.service';
import { FindLeadScenariosQuery } from './dto/find-lead-scenarios-query.dto';
import { FindLeadsQuery } from './dto/find-leads.dto';
import ISO6391 from 'iso-639-1';
import { GenerateLeadScenarioReq } from '../account-scenarios/dto/generate-lead-scenario.dto';
import { AccountScenariosService } from '../account-scenarios/account-scenarios.service';
import { FindLeadsByAccountsAndScenariosReq } from './dto/find-leads-by-accounts.dto';
import { Op, Sequelize, WhereOptions } from 'sequelize';
import { UsersAccountsService } from '../users/users-accounts.service';
import { LinkedinProvider, LinkedinSearchBody } from '../linkedin/linkedin.provider';

@Injectable()
export class LeadScenariosService {
  private readonly logger = new Logger(LeadScenariosService.name);

  constructor(
    @InjectModel(LeadScenarioModel)
    private readonly leadScenarioModel: typeof LeadScenarioModel,
    @InjectModel(SavedLead)
    private readonly savedLeadModel: typeof SavedLead,
    @InjectModel(SavedAccount)
    private readonly savedAccountModel: typeof SavedAccount,
    @InjectModel(SearchLeadsResult)
    private readonly searchLeadsResultModel: typeof SearchLeadsResult,
    private readonly accountScenariosService: AccountScenariosService,
    private readonly leadScenarioFiltersService: LeadScenariosFiltersService,
    private readonly linkedinProvider: LinkedinProvider,
    private readonly usersAccountsService: UsersAccountsService,
    private readonly accountScenarioService: AccountScenariosService,
  ) {}

  async create(
    dto: CreateLeadScenarioReq,
    userId: string,
  ): Promise<LeadScenarioModel | null> {
    try {
      const leadScenario = await this.leadScenarioModel.create({
        name: dto.name,
        userId,
      });
      return leadScenario;
    } catch (error) {
      this.logger.error(
        `Failed to create lead scenario`,
        error.stack
      );
      throw new BadRequestException('Unable to create lead scenario');
    }
  }
  
  async findAll(
    companyId: string,
    query: FindLeadScenariosQuery = {},
  ): Promise<LeadScenarioModel[]> {
    const leadScenarios = await this.leadScenarioModel.findAll({
      include: [
        {
          model: User,
          where: { companyId },
          required: true,
          attributes: ['firstName', 'lastName'],
        },
      ],
      limit: query.limit ?? 100,
      offset: query.offset ?? 0,
    });
    return leadScenarios;
  }

  async findById(id: string): Promise<LeadScenarioModel | null> {
    const leadScenario = await this.leadScenarioModel.findOne({
      where: { id },
      include: [
        {
          model: LeadScenarioFilterModel,
          required: false,
          include: [
            {
              model: LeadScenarioFilterValueModel,
              required: true,
              attributes: ['id', 'filterKey', 'filterValue'],
            }
          ],
        },
      ],
    });

    if (!leadScenario) {
      throw new NotFoundException('Lead scenario not found');
    }

    return leadScenario;
  }

  async update(
    id: string,
    dto: UpdateLeadScenarioReq,
  ): Promise<LeadScenarioModel | null> {
    if (dto.filterId) {
      await this.leadScenarioFiltersService.findById(dto.filterId);
    }

    const updateLeadScenarioResult = await this.leadScenarioModel.update(dto, {
      where: { id },
      returning: true,
    });

    if (!updateLeadScenarioResult[0]) {
      throw new NotFoundException('Lead scenario not found');
    }

    await this.removeSearchResult(id);

    return updateLeadScenarioResult[1][0];
  }

  async remove(id: string): Promise<void> {
    await this.leadScenarioModel.destroy({
      where: { id },
    });
    await this.removeSearchResult(id);
    return;
  }

  async findLeads(
    id: string,
    query: FindLeadsQuery = {},
    userId: string,
  ) {
    const savedSearchResult = await this.findLeadsFromSavedResults(id, query?.cursor);
    if (savedSearchResult) {
      return savedSearchResult.data;
    }

    const accountId = await this.usersAccountsService.findLinkedinAccountId(userId);
    const body: LinkedinSearchBody = {
      'api': 'sales_navigator',
      'category': 'people',
    };

    const { filter } = await this.findById(id);

    try {
      for (const value of filter?.filterValues ?? []) {

        if (value.filterKey === LeadScenarioFilterKey.FIRST_NAME) {
          body['first_name'] = value.filterValue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.LAST_NAME) {
          body['last_name'] = value.filterValue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.LANGUAGE) {
          body['profile_language'] = value.filterValue['map']((v) => ISO6391.getCode(v));
        }
  
        if (value.filterKey === LeadScenarioFilterKey.JOB_TITLE) {
          body['role'] = { 
            ...(value.filterValue['include'].length && { include: value.filterValue['include'].map((v) => v.id) }),
            ...(value.filterValue['exclude'].length && { exclude: value.filterValue['exclude'].map((v) => v.id) }),
          }
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.JOB_TENURE) {
          body['tenure_at_role'] = [
            {
              min: Number(value.filterValue['from']),
              max: Number(value.filterValue['to']),
            },
          ];
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.PAST_JOB_TITLE) {
          body['past_role'] = { 
            ...(value.filterValue['include'].length && { include: value.filterValue['include'].map((v) => v.id) }),
            ...(value.filterValue['exclude'].length && { exclude: value.filterValue['exclude'].map((v) => v.id) }),
          }
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.SENIORITY) {
          body['seniority'] = { 
            ...(value.filterValue['include'].length && { include: value.filterValue['include'] }),
            ...(value.filterValue['exclude'].length && { exclude: value.filterValue['exclude'] }),
          }
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.EXPERIENCE_YEARS) {
          body['tenure'] = [
            {
              min: Number(value.filterValue['from']),
              max: Number(value.filterValue['to']),
            },
          ];
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.SCHOOL) {
          body['school'] = { 
            ...(value.filterValue['include'].length && { include: value.filterValue['include'].map((v) => v.id) }),
            ...(value.filterValue['exclude'].length && { exclude: value.filterValue['exclude'].map((v) => v.id) }),
          }
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.LOCATION) {
          body['location'] = { 
            ...(value.filterValue['include'].length && { include: value.filterValue['include'].map((v) => v.id) }),
            ...(value.filterValue['exclude'].length && { exclude: value.filterValue['exclude'].map((v) => v.id) }),
          }
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.POSTED_ON_LINKEDIN) {
          body['posted_on_linkedin'] = value.filterValue;
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.MENTIONED_IN_NEWS) {
          body['mentionned_in_news'] = value.filterValue;
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.VIEWED_YOUR_PROFILE) {
          body['viewed_your_profile_recently'] = value.filterValue;
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.FOLLOWING_YOUR_COMPANY) {
          body['following_your_company'] = value.filterValue;
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.PAST_COLLEAGUE) {
          body['past_colleague'] = value.filterValue;
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.SHARED_EXPERIENCES) {
          body['shared_experiences'] = value.filterValue;
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.NETWORK_DISTANCE) {
          body['network_distance'] = [Number(value.filterValue)];
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.CHANGED_JOBS) {
          body['changed_jobs'] = value.filterValue;
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.KEYWORDS) {
          body['keywords'] = value.filterValue;
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.CURRENT_COMPANY) {
          body['company'] = { 
            ...(value.filterValue['include'].length && { include: value.filterValue['include'].map((v) => v.id) }),
            ...(value.filterValue['exclude'].length && { exclude: value.filterValue['exclude'].map((v) => v.id) }),
          }
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.PAST_COMPANY) {
          body['past_company'] = { 
            ...(value.filterValue['include'].length && { include: value.filterValue['include'].map((v) => v.id) }),
            ...(value.filterValue['exclude'].length && { exclude: value.filterValue['exclude'].map((v) => v.id) }),
          }
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.COMPANY_HEADCOUNT) {
          body['company_headcount'] = [
            {
              min: Number(value.filterValue['from']),
              max: Number(value.filterValue['to']),
            },
          ];
          continue;
        }
  
       if (value.filterKey === LeadScenarioFilterKey.COMPANY_INDUSTRY) {
          body['industry'] = { 
            ...(value.filterValue['include'].length && { include: value.filterValue['include'].map((v) => v.id) }),
            ...(value.filterValue['exclude'].length && { exclude: value.filterValue['exclude'].map((v) => v.id) }),
          }
          continue;
        }
  
       if (value.filterKey === LeadScenarioFilterKey.COMPANY_LOCATION) {
          body['company_location'] = { 
            ...(value.filterValue['include'].length && { include: value.filterValue['include'].map((v) => v.id) }),
            ...(value.filterValue['exclude'].length && { exclude: value.filterValue['exclude'].map((v) => v.id) }),
          }
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.COMPANY_TYPE) {
          body['company_type'] = value.filterValue['map']((v) => v.toLowerCase().replace(/\s+/g, '_'));
          continue;
        }
  
        if (value.filterKey === LeadScenarioFilterKey.COMPANY_TENURE) {
          body['tenure_at_company'] = [
            {
              min: Number(value.filterValue['from']),
              max: Number(value.filterValue['to']),
            },
          ];
          continue;
        }
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException('Invalid filter format');
    }

    const data = await this.linkedinProvider.search(accountId, body, {
      limit: query?.limit,
      cursor: query?.cursor,
    });

    await this.searchLeadsResultModel.create({
      leadScenarioId: id,
      cursor: query.cursor,
      data,
    });

    return data;
  }

  async findLeadsFromSavedResults(leadScenarioId: string, cursor?: string) {
    const baseWhere: any = {
      leadScenarioId
    };

    if (cursor) {
      baseWhere.cursor = cursor;
    }

    const searchLeadResult = await this.searchLeadsResultModel.findOne({
      where: baseWhere,
    });

    return searchLeadResult;
  }

  async removeSearchResult(leadScenarioId: string) {
    await this.searchLeadsResultModel.destroy({
      where: {
        leadScenarioId,
      },
    });
    return;
  } 

  async saveLeads(
    id: string,
    dto: { leads: FindLeadsRes[] },
    companyId: string,
    userId: string,
  ) {
    await this.findById(id);
    const savedAccounts = await this.savedAccountModel.findAll({
      where: { companyId },
    });

    try {
      const existingAccountsMap = new Map(
        savedAccounts.map(account => [account.accountData.id, account])
      );

      const data = [];
      for (const lead of dto.leads) {
        const accountId = lead.current_positions?.[0]?.company_id;
        if (!accountId) {
          continue;
        }

        let leadAccount = existingAccountsMap.get(accountId);

        if (!leadAccount && accountId) {
          leadAccount = await this.accountScenariosService.createAccountForLead(
            accountId,
            companyId,
            userId,
          );
          existingAccountsMap.set(accountId, leadAccount);
        }

        data.push({
          leadData: lead,
          leadScenarioId: id,
          accountId: leadAccount ? leadAccount.id : null,
          companyId,
        });
      }

      const savedLeads = await this.savedLeadModel.bulkCreate(data);
      return savedLeads;
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(`Unable to save leads for scenario: ${id}`);
    }
  }

  async findSavedLead(id: string) {
    const savedLeads = await this.savedLeadModel.findAll({
      where: { leadScenarioId: id },
    });

    return savedLeads;
  }

  async removeSavedLead(leadId: string): Promise<void> {
    await this.savedLeadModel.destroy({
      where: { id: leadId },
    });
    return;
  }

  async createLeadScenarioWithAccounts(
    dto: GenerateLeadScenarioReq,
    userId: string,
  ) {
    const accountScenario = await this.accountScenariosService.findById(dto.accountScenarioId);
    const leadScenario = await this.create({
      name: accountScenario.name,
    }, userId);
    const accounts = await this.accountScenariosService.findManyAccountsById(dto.accountIds);

    const includedAccounts = accounts.map((account) => {
      return {
        id: account.accountData.id,
        title: account.accountData.name,
      };
    });

    await this.leadScenarioFiltersService.create({
      leadScenarioId: leadScenario.id,
      filterValues: [
        {
          filterKey: LeadScenarioFilterKey.CURRENT_COMPANY,
          filterValue: {
            include: includedAccounts,
            exclude: [],
          },
        },
      ],
    }, userId);

    return await this.findById(leadScenario.id);
  }

  async findLeadsByAccountsAndScenarios(
    dto: FindLeadsByAccountsAndScenariosReq,
  ): Promise<SavedLead[]> {
    const conditions: WhereOptions[] = [];
    const accounts = await this.accountScenariosService.findManyAccountsById(dto.accountsIds);
    let targetAccountJsonIds = [];
    let sqlFormattedIds = '';

    if (accounts && accounts.length > 0) {
      targetAccountJsonIds = accounts
          .map(account => account.accountData?.id)
          .filter(id => id !== null && id !== undefined);
      sqlFormattedIds = targetAccountJsonIds
      .map(id => `'${id.replace(/'/g, "''")}'`)
      .join(',');

      conditions.push(
        Sequelize.literal(
            `EXISTS (
                SELECT 1
                FROM jsonb_array_elements("lead_data"->'current_positions') AS pos(element)
                WHERE pos.element->>'company_id' IN (${sqlFormattedIds})
            )`
        ),
      );
    }

    if (dto.leadScenariosIds && dto.leadScenariosIds.length > 0) {
      conditions.push({
        leadScenarioId: {
              [Op.in]: dto.leadScenariosIds
          },
      });
    }

    let whereClause: WhereOptions = {};

    if (conditions.length > 0) {
      whereClause = {
         [Op.or]: conditions,
      };
    }

    const leads = await this.savedLeadModel.findAll({
      where: whereClause,
    });

    return leads;
  }
}
