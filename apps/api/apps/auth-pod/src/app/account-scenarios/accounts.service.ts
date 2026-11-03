import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAccountsRes, SavedAccount, SavedLead } from '@willbe-server/db-core';
import { AccountLeadRes, AccountRes, FindAccountLeadsReq, RemoveAccountsReq } from './dto/account.dto';
import { Op, Sequelize, WhereOptions } from 'sequelize';
import { UpdateAccountReq } from './dto/update-account.dto';

@Injectable()
export class AccountsService {  
  private readonly logger = new Logger(AccountsService.name);
   
  constructor(
    @InjectModel(SavedAccount)
    private readonly savedAccountModel: typeof SavedAccount,
    @InjectModel(SavedLead)
    private readonly savedLeadModel: typeof SavedLead,
  ) {}

  async findById(savedAccountId: string): Promise<AccountRes> {
    const savedAccount = await this.savedAccountModel.findOne({
      where: {
        id: savedAccountId,
      }
    });

    if (!savedAccount) {
      throw new NotFoundException('Account not found');
    }

    return {
      id: savedAccount.id,
      companyTitle: savedAccount.accountData?.name ?? null,
      foundedIn: savedAccount.accountData?.founded_year ?? null,
      headquarters: savedAccount.accountData?.headquarters ?? null,
      employees: savedAccount.accountData?.headcount ?? null,
      industry: savedAccount.accountData?.industry ?? null,
      website: savedAccount.accountData?.website ?? null,
      linkedin: savedAccount.accountData?.profile_url ?? null,
      description: savedAccount.accountData?.summary ?? null,
      logo: savedAccount.accountData?.logo ?? null,
      isConnectedToHubspot: savedAccount.isSyncedWithCrm,
    };
  }

  async createAccount(
    dto: UpdateAccountReq,
    companyId: string,
  ) {
    try {
      const accountData: FindAccountsRes = {
        id: null,
        type: 'COMPANY',
        name: dto?.companyTitle || null,
        profile_url: dto?.linkedin || null,
        founded_year: dto?.foundedIn || null,
        location: dto?.headquarters || null,
        headcount: dto?.employees || null,
        industry: dto?.industry || null,
        summary: dto?.description || null,
        logo: null,
      };
  
      const account = await this.savedAccountModel.create({
        accountData,
        companyId,
        isSyncedWithCrm: false,
      });
  
      return account;
    } catch (error) {
      this.logger.error(
        `Failed to create account`,
        error.stack
      );
      throw new BadRequestException('Unable to create account');
    }
  }

  async update(
    savedAccountId: string,
    dto: UpdateAccountReq,
  ): Promise<AccountRes> {
    const savedAccount = await this.savedAccountModel.findOne({
      where: {
        id: savedAccountId,
      },
    });

    if (!savedAccount) {
      throw new NotFoundException('Account not found');
    }

    if (dto?.companyTitle) {
      savedAccount.accountData.name = dto.companyTitle;
    }

    if (dto?.foundedIn) {
      savedAccount.accountData.founded_year = dto.foundedIn;
    }
    
    if (dto?.headquarters) {
      savedAccount.accountData.headquarters = dto.headquarters;
    }

    if (dto?.employees) {
      savedAccount.accountData.headcount = dto.employees;
    }

    if (dto?.industry) {
      savedAccount.accountData.industry = dto.industry;
    }

    if (dto?.website) {
      savedAccount.accountData.website = dto.website;
    }

    if (dto?.linkedin) {
      savedAccount.accountData.profile_url = dto.linkedin;
    }

    if (dto?.description) {
      savedAccount.accountData.summary = dto.description;
    }

    savedAccount.changed('accountData', true);
    await savedAccount.save();

    return this.findById(savedAccountId);
  }

  async findLeadsForAccount(
    savedAccountId: string,
    query: FindAccountLeadsReq = {},
  ): Promise<AccountLeadRes[]> {
    const savedAccount = await this.savedAccountModel.findOne({
      where: { id: savedAccountId },
    });

    if (!savedAccount) {
      throw new NotFoundException('Account not found');
    }

    const companyId = savedAccount.accountData.id;

    const baseWhere: any = {
      accountId: savedAccount.id,
    };
  
    let where: any = baseWhere;
    let limit: number | undefined = undefined;
    let offset: number | undefined = undefined;
    if (query.limit && typeof query.limit === 'number') {
      limit = query.limit;
    }
    if (query.offset && typeof query.offset === 'number') {
      offset = query.offset;
    }
    if (query.keywords) {
      const keyword = query.keywords.replace(/'/g, "''");

      const keywordConditions = [
        Sequelize.literal(`"lead_data"->>'first_name' ILIKE '%${keyword}%'`),
        Sequelize.literal(`"lead_data"->>'last_name' ILIKE '%${keyword}%'`),
        Sequelize.literal(`"lead_data"->>'email' ILIKE '%${keyword}%'`),
        Sequelize.literal(`
          EXISTS (
            SELECT 1
            FROM jsonb_array_elements(
              CASE
                WHEN jsonb_typeof("lead_data"->'current_positions') = 'array'
                THEN "lead_data"->'current_positions'
                ELSE '[]'::jsonb
              END
            ) AS pos(element)
            WHERE pos.element->>'role' ILIKE '%${keyword}%'
              AND pos.element->>'company_id' = '${companyId.replace(/'/g, "''")}'
          )
        `),
      ];

      where = {
        [Op.and]: [
          baseWhere,
          {
            [Op.or]: keywordConditions
          },
        ],
      };
    }
    
    const leads = await this.savedLeadModel.findAll({ where, limit, offset });
    
    const leadsRes: AccountLeadRes[] = leads.map((lead) => {
      return {
        id: lead.id,
        firstName: lead.leadData?.first_name ?? null,
        lastName: lead.leadData?.last_name ?? null,
        email: lead.leadData?.email ?? null,
        phone: lead.leadData?.phone ?? null,
        role: lead.leadData?.current_positions?.[0]?.role ?? null,
      };
    });

    return leadsRes;
  }

  async removeAccounts(dto: RemoveAccountsReq) {
    await this.savedAccountModel.destroy({
      where: {
        id: {
          [Op.in]: dto.accountIds,
        },
      },
    });
    return;
  }
}
