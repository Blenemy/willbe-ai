import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  AccountScenarioModel,
  User,
  AccountScenariosFilterValueModel,
  AccountScenarioFilterKey,
  SavedAccount,
  FindAccountsRes,
  SearchAccountsResult,
} from '@willbe-server/db-core';
import { CreateAccountScenarioReq } from './dto/create-account-scenario.dto';
import { UpdateAccountScenarioReq } from './dto/update-account-scenario.dto';
import { FindAccountScenariosQuery } from './dto/find-account-scenarios-query.dto';
import { Sequelize } from 'sequelize-typescript';
import { FindAccountsQuery } from './dto/find-accounts.query';
import { Op, cast } from 'sequelize';
import { FindSavedAccountsDto } from './dto/find-saved-accounts.dto';
import { UsersAccountsService } from '../users/users-accounts.service';
import { LinkedinProvider, LinkedinSearchBody, LinkedinSearchPage } from '../linkedin/linkedin.provider';

@Injectable()
export class AccountScenariosService {
  private readonly logger = new Logger(AccountScenariosService.name);

  constructor(
    @InjectModel(AccountScenarioModel)
    private readonly accountScenarioModel: typeof AccountScenarioModel,
    @InjectModel(AccountScenariosFilterValueModel)
    private readonly accountScenariosFilterValueModel: typeof AccountScenariosFilterValueModel,
    @InjectModel(SavedAccount)
    private readonly savedAccountModel: typeof SavedAccount,
    @InjectModel(SearchAccountsResult)
    private readonly searchAccountsResultModel: typeof SearchAccountsResult,
    private readonly sequelize: Sequelize,
    private readonly linkedinProvider: LinkedinProvider,
    private readonly usersAccountsService: UsersAccountsService,
  ) {}

  async create(
    dto: CreateAccountScenarioReq,
    userId: string,
  ): Promise<AccountScenarioModel | null> {
    try {
      const accountScenario = await this.accountScenarioModel.create({
        name: dto.name,
        userId,
      });
      return accountScenario;
    } catch (error) {
      this.logger.error(
        `Failed to create account scenario`,
        error.stack
      );
      throw new BadRequestException('Unable to create account scenario');
    }
  }
  
  async findAll(
    companyId: string,
    query: FindAccountScenariosQuery = {},
  ): Promise<AccountScenarioModel[]> {
    const accountScenarios = await this.accountScenarioModel.findAll({
      include: [
        {
          model: User,
          where: { companyId },
          required: true,
          attributes: ['firstName', 'lastName'],
        },
        {
          model: AccountScenariosFilterValueModel,
          required: false,
          attributes: ['id', 'filterKey', 'filterValue'],
        },
      ],
      limit: query.limit ?? 100,
      offset: query.offset ?? 0,
    });
    return accountScenarios;
  }

  async findById(id: string): Promise<AccountScenarioModel | null> {
    const accountScenario = await this.accountScenarioModel.findOne({
      where: { id },
      include: [
        {
          model: AccountScenariosFilterValueModel,
          required: false,
          attributes: ['id', 'filterKey', 'filterValue'],
        },
      ],
    });

    if (!accountScenario) {
      throw new NotFoundException('Account scenario not found');
    }

    return accountScenario;
  }

  async update(
    id: string,
    dto: UpdateAccountScenarioReq,
  ): Promise<AccountScenarioModel | null> {
    const transaction = await this.sequelize.transaction();
    try {
      const accountScenario = await this.accountScenarioModel.findOne({
        where: { id },
        transaction,
      });

      if (!accountScenario) {
        throw new NotFoundException('Account scenario not found');
      }

      if (dto.name) {
        accountScenario.name = dto.name;
        await accountScenario.save({ transaction });
      }

      if (dto?.filterValues) {
        const filterValues = dto.filterValues.map((value) => {
          return { ...value, accountScenarioId: accountScenario.id };
        });
  
        await Promise.all([
          this.accountScenariosFilterValueModel.destroy({
            where: { accountScenarioId: id },
            transaction,
          }),
          this.accountScenariosFilterValueModel.bulkCreate(filterValues, {
            transaction,
          }),
        ]);
      }

      await transaction.commit();
      await this.removeSearchResult(id);

      return this.findById(id);
    } catch (error) {
      await transaction.rollback();
      this.logger.error(
        `Failed to update account scenario`,
        error,
      );
      throw new BadRequestException('Unable to update account scenario');
    }
  }

  async remove(id: string): Promise<void> {
    await this.accountScenarioModel.destroy({
      where: { id },
    });
    await this.removeSearchResult(id);
    return;
  }

  async findAccounts(
    id: string,
    query: FindAccountsQuery = {},
    userId: string,
  ) {
    const searchText = query?.query?.trim();

    if (!searchText) {
      const savedSearchResult = await this.findAccountsFromSavedResults(id, query?.cursor);
      if (savedSearchResult) {
        return savedSearchResult.data;
      }
    }

    const accountId = await this.usersAccountsService.findLinkedinAccountId(userId);
    const body: LinkedinSearchBody = {
      'api': 'sales_navigator',
      'category': 'companies',
    };

    const accountScenario = await this.findById(id);
    const { filterValues } = accountScenario;

    try {
      for (const value of filterValues ?? []) {

        if (value.filterKey === AccountScenarioFilterKey.INDUSTRY) {
          body['industry'] = { 
            ...(value.filterValue['include'].length && { include: value.filterValue['include'].map((v) => v.id) }),
            ...(value.filterValue['exclude'].length && { exclude: value.filterValue['exclude'].map((v) => v.id) }),
          }
          continue;
        }
        
        if (value.filterKey === AccountScenarioFilterKey.LOCATION) {
          body['location'] = { 
            include: value.filterValue['include'].map((value) => value.id),
            ...(value.filterValue['include'].length && { include: value.filterValue['include'].map((v) => v.id) }),
            ...(value.filterValue['exclude'].length && { exclude: value.filterValue['exclude'].map((v) => v.id) }),
          }
          continue;
        }
  
        if (value.filterKey === AccountScenarioFilterKey.HEADCOUNT) {
          body['headcount'] = [
            {
              min: Number(value.filterValue['from']),
              max: Number(value.filterValue['to']),
            },
          ];
          continue;
        }
  
        if (value.filterKey === AccountScenarioFilterKey.HEADCOUNT_GROWTH) {
          body['headcount_growth'] = {
              min: Number(value.filterValue['from']),
              max: Number(value.filterValue['to']),
          };
          continue;
        }
  
        if (value.filterKey === AccountScenarioFilterKey.FORTUNE) {
          body['fortune'] = [
            {
              min: Number(value.filterValue['from']),
              max: Number(value.filterValue['to']),
            },
          ];
          continue;
        }
  
        if (value.filterKey === AccountScenarioFilterKey.FOLLOWERS_COUNT) {
          body['followers_count'] = [
            {
              min: Number(value.filterValue['from']),
              max: Number(value.filterValue['to']),
            },
          ];
          continue;
        }
  
        if (value.filterKey === AccountScenarioFilterKey.RECENT_ACTIVITIES) {
          body['recent_activities'] = [value.filterValue['value']];
          continue;
        }
  
        if (value.filterKey === AccountScenarioFilterKey.HAS_JOB_OFFERS) {
          body['has_job_offers'] = value.filterValue;
          continue;
        }
  
        if (value.filterKey === AccountScenarioFilterKey.TECHNOLOGY) {
          body['technologies'] = value.filterValue['map']((v) => v.id);
          continue;
        }
  
        if (value.filterKey === AccountScenarioFilterKey.NETWORK_DISTANCE) {
          body['network_distance'] = [Number(value.filterValue)];
          continue;
        }
  
        if (value.filterKey === AccountScenarioFilterKey.KEYWORDS) {
          body['keywords'] = value.filterValue;
          continue;
        }
  
        if (value.filterKey === AccountScenarioFilterKey.DEPARTMENT_HEADCOUNT) {
          body['department_headcount'] = {
              min: Number(value.filterValue['from']),
              max: Number(value.filterValue['to']),
          };
          continue;
        }

        if (value.filterKey === AccountScenarioFilterKey.DEPARTMENT_HEADCOUNT_GROWTH) {
          body['department_headcount_growth'] = [
            {
              min: Number(value.filterValue['from']),
              max: Number(value.filterValue['to']),
            },
          ];
          continue;
        }
  
        if (value.filterKey === AccountScenarioFilterKey.SAVED_ACCOUNTS) {
          body['saved_accounts'] = value.filterValue['map']((v) => v.id);
          continue;
        }
  
        if (value.filterKey === AccountScenarioFilterKey.ANNUAL_REVENUE) {
          const currency = filterValues.find((value) => value.filterKey === AccountScenarioFilterKey.ANNUAL_REVENUE_CURRENCY);
          body['annual_revenue'] = {
            min: Number(value.filterValue['from']),
            max: Number(value.filterValue['to']),
            currency: currency.filterValue,
          };
          continue;
        }
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException('Invalid filter format');
    }

    if (searchText) {
      body['keywords'] = [body['keywords'], searchText].filter(Boolean).join(' ');
    }

    const accountsResult = await this.linkedinProvider.search(accountId, body, {
      limit: query?.limit,
      cursor: query?.cursor,
    }) as LinkedinSearchPage<{ id: string; isSaved?: boolean }>;
    const savedAccounts = await this.savedAccountModel.findAll({
      where: {
        accountScenarioId: id,
      },
    });

    const savedAccountsIds = new Set(savedAccounts.map(account => account.accountData['id']));
    accountsResult.items.forEach((account) => {
      account.isSaved = savedAccountsIds.has(account.id);
    });

    if (!searchText) {
      await this.searchAccountsResultModel.create({
        accountScenarioId: id,
        cursor: query.cursor,
        data: accountsResult,
      });
    }

    return accountsResult;
  }

  async findAccountsFromSavedResults(accountScenarioId: string, cursor?: string) {
    const baseWhere: any = {
      accountScenarioId
    };

    if (cursor) {
      baseWhere.cursor = cursor;
    }

    const searchAccountsResult = await this.searchAccountsResultModel.findOne({
      where: baseWhere,
    });

    return searchAccountsResult;
  }

  async removeSearchResult(accountScenarioId: string) {
    await this.searchAccountsResultModel.destroy({
      where: {
        accountScenarioId,
      },
    });
    return;
  } 

  async saveAccounts(
    id: string,
    dto: { accounts: FindAccountsRes[] },
    companyId: string,
  ): Promise<SavedAccount[]> {
    await this.findById(id);

    const savedAccounts = await this.savedAccountModel.findAll({
      where: {
        companyId,
      },
    });

    const savedAccountsIds = new Set(savedAccounts.map(account => account.accountData['id']));
    const filteredAccounts = dto.accounts.filter(account => !savedAccountsIds.has(account.id));

    try {
      const data = filteredAccounts.map((account) => {
        delete account?.isSaved;

        return {
          accountData: account,
          accountScenarioId: id,
          companyId,
        };
      });

      const savedAccounts = await this.savedAccountModel.bulkCreate(data);
      return savedAccounts;
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(`Unable to save accounts for scenario: ${id}`);
    }
  }

  async createAccountForLead(
    accountId: string,
    companyId: string,
    userId: string,
  ): Promise<SavedAccount | null> {
    const linkedinAccountId = await this.usersAccountsService.findLinkedinAccountId(userId);
    const company = await this.linkedinProvider.getCompany(linkedinAccountId, accountId);

    const accountData = {
      id: company.id,
      logo: company.logo_large,
      name: company.name,
      type: 'COMPANY',
      summary: company.description,
      industry: company.industry?.[0] || null,
      location: company.locations?.[0] ? {
        city: company.locations[0].city,
        country: company.locations[0].country,
        area: company.locations[0].area
      } : null,
      headcount: company.employee_count_range ? `${company.employee_count_range.from}-${company.employee_count_range.to}` : null,
      profile_url: company.profile_url
    };

    const savedAccount = await this.savedAccountModel.create({
      accountData,
      companyId,
      userId,
    });

    return savedAccount;
  }

  async findSavedAccounts(id: string): Promise<SavedAccount[]> {
    const savedAccounts = await this.savedAccountModel.findAll({
      where: { accountScenarioId: id },
    });

    return savedAccounts;
  }

  async findManyAccountsById(ids: string[]): Promise<SavedAccount[]> {
    const savedAccounts = await this.savedAccountModel.findAll({
      where: { id: ids },
    });

    return savedAccounts;
  }

  async removeSavedAccount(accountId: string) {
    await this.savedAccountModel.destroy({
      where: { id: accountId },
    });
    return;
  }

  async findAllSavedAccounts(
    companyId: string,
    query: FindSavedAccountsDto = {},
  ): Promise<any[]> {
    const mainWhere: any = {};
    if (query.name) {
      mainWhere[Op.and] = [
        this.sequelize.where(
          cast(this.sequelize.json('account_data.name'), 'text'),
          Op.iLike,
          `%${query.name}%`,
        )
      ];
    }

    const allAccounts = await this.savedAccountModel.findAll({
      where: {
        ...mainWhere,
        companyId,
      },
      include: [
        { model: User },
        { model: AccountScenarioModel, include: [{ model: User }] },
      ],
      attributes: ['id', 'accountData', 'createdAt', 'isSyncedWithCrm'],
      limit: query.limit ? Number(query.limit) : 100,
      offset: query.offset ? Number(query.offset) : 0,
    });

    return allAccounts.map(account => {
      const plainAccount = account.get({ plain: true }) as any;
      let user = plainAccount.accountScenario?.user ?? plainAccount?.user;
      
      const result = {
        id: plainAccount.id,
        accountData: plainAccount.accountData,
        createdAt: plainAccount.createdAt,
        isSyncedWithCrm: plainAccount.isSyncedWithCrm,
        createdBy: user ? `${user.firstName} ${user.lastName}` : 'CRM'
      };
      
      return result;
    });
  }
} 