import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CompanyProduct,
  MessageEntry,
  MessageEntryLeadData,
  MessageEntryType,
  MessageLanguage,
  MessageScenario,
  MessageScenarioStatus,
  MessageStructure,
  MessageSubjectType,
  MessageTemplate,
  SavedLead,
  SentEmailMessage,
  SentMessageStatus,
  User,
} from '@willbe-server/db-core';
import { CreateMessageEntryReq } from './dto/create-message-entry.dto';
import { UpdateMessageEntryReq } from './dto/update-message-entry.dto';
import { MessageScenariosService } from './message-scenarios.service';
import { Sequelize } from 'sequelize-typescript';
import { UpdateMessageEntryLeadDto } from './dto/update-message-entry-lead.dto';
import { CompaniesProductsService } from '../companies/companies-products.service';
import { MessageStructuresService } from '../message-structures/message-structures.service';
import { format } from '@fast-csv/format';
import { Writable } from 'node:stream';
import { MessageEntriesDataIdsDto } from './dto/message-entries-ids.dto';
import { Op, fn, col, where, literal, QueryTypes } from 'sequelize';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ClaudeService } from './claude.service';
import { UsersAccountsService } from '../users/users-accounts.service';
import { CompaniesService } from '../companies/companies.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { inspect } from 'node:util';
import { UpdateFollowUpEntryDto } from './dto/update-follow-up-entry.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import * as moment from 'moment';
import { LinkedinProvider } from '../linkedin/linkedin.provider';
import { pickTemplate } from './pick-template';
import { BulkUpdateMessageEntryLeadsDto } from './dto/bulk-update-message-entry-leads.dto';

const COUNTRY_LANGUAGES: [RegExp, MessageLanguage][] = [
  [/\b(france|belgique|québec)\b/i, MessageLanguage.FR],
  [/\b(spain|españa|mexico|méxico|argentina|colombia|chile|peru)\b/i, MessageLanguage.ES],
  [/\b(germany|deutschland|austria|switzerland)\b/i, MessageLanguage.DE],
  [/\b(italy|italia)\b/i, MessageLanguage.IT],
  [/\b(portugal|brazil|brasil)\b/i, MessageLanguage.PT],
  [/\b(israel)\b/i, MessageLanguage.HE],
];

function detectLanguageFromLocation(location: string): MessageLanguage {
  return COUNTRY_LANGUAGES.find(([pattern]) => pattern.test(location))?.[1] ?? MessageLanguage.EN;
}

@Injectable()
export class MessageEntriesService {
  private readonly logger = new Logger(MessageEntriesService.name);

  constructor(
    @InjectModel(MessageEntry)
    private messageEntryModel: typeof MessageEntry,
    @InjectModel(MessageEntryLeadData)
    private readonly messageEntryLeadDataModel: typeof MessageEntryLeadData,
    @InjectModel(MessageStructure)
    private readonly messageStructureModel: typeof MessageStructure,
    @InjectModel(MessageScenario)
    private readonly messageScenarioModel: typeof MessageScenario,
    @InjectModel(CompanyProduct)
    private readonly companyProductModel: typeof CompanyProduct,
    private readonly messageScenarioService: MessageScenariosService,
    private readonly companiesProductsService: CompaniesProductsService,
    private readonly messageStructureService: MessageStructuresService,
    private readonly sequelize: Sequelize,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly claudeService: ClaudeService,
    private readonly userAccountsService: UsersAccountsService,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
    @InjectQueue('messages-sending')
    private readonly messagesSendingQueue: Queue,
    @InjectQueue('messages-generation')
    private readonly messagesGenerationQueue: Queue,
    private readonly eventEmitter: EventEmitter2,
    private readonly usersAccountsService: UsersAccountsService,
    private readonly linkedinProvider: LinkedinProvider,
  ) {}

  private generationEvents?: QueueEvents;

  private async getGenerationEvents(): Promise<QueueEvents> {
    if (!this.generationEvents) {
      this.generationEvents = new QueueEvents('messages-generation', {
        connection: this.messagesGenerationQueue.opts.connection,
      });
    }
    await this.generationEvents.waitUntilReady();
    return this.generationEvents;
  }

  async create(dto: CreateMessageEntryReq): Promise<MessageEntry | null> {
    const messageScenario = await this.messageScenarioService.findById(
      dto.messageScenarioId,
    );

    const transaction = await this.sequelize.transaction();

    try {
      const { sendDate } = dto;
      let sendDateUtc: Date | null = null;

      if (sendDate) {
        sendDateUtc = moment.parseZone(sendDate).utc().toDate();
      }

      const messageEntry = await this.messageEntryModel.create({
        ...dto,
        sendDateUtc,
      }, { transaction });

      if (
        messageEntry.type === MessageEntryType.FOLLOW_UP_EMAIL
        || messageEntry.type === MessageEntryType.LINKEDIN_FOLLOW_UP
      ) {
        let firstMessageEntry: MessageEntry;

        firstMessageEntry = await this.messageEntryModel.findOne({
          where: {
            messageScenarioId: messageScenario.id,
            type: MessageEntryType.FIRST_EMAIL,
          },
          include: {
            model: MessageEntryLeadData,
          }
        });

        if (!firstMessageEntry) {
          firstMessageEntry = await this.messageEntryModel.findOne({
            where: {
              messageScenarioId: messageScenario.id,
              type: MessageEntryType.LINKEDIN_CONNECTION,
            },
            include: {
              model: MessageEntryLeadData,
            }
          }); 
        }

        if (!firstMessageEntry) {
          throw new BadRequestException('First email message entry not found');
        }

        const messageEntryLeadData = messageScenario.leads.map((lead, index) => {
          return {
            leadId: lead.id,
            messageEntryId: messageEntry.id,
            email: firstMessageEntry.messageEntryLeadData[index].email,
            phone: firstMessageEntry.messageEntryLeadData[index].phone,
            language: firstMessageEntry.messageEntryLeadData[index].language,
            messageStructureId: null,
            productServiceId: firstMessageEntry.messageEntryLeadData[index].productServiceId,
            message: null,
          };
        });

        await this.messageEntryLeadDataModel.bulkCreate(messageEntryLeadData, { transaction });

        await transaction.commit();
        return messageEntry;
      }

      const messageEntryLeadData = messageScenario.leads.map((lead) => {
        return {
          leadId: lead.id,
          messageEntryId: messageEntry.id,
          email: null,
          phone: null,
          language: null,
          messageStructureId: null,
          productServiceId: null,
          message: null,
        };
      });

      await this.messageEntryLeadDataModel.bulkCreate(messageEntryLeadData, { transaction });

      await transaction.commit();
      return messageEntry;
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new BadRequestException('Unable to create message entry');
    }
  }

  async findById(id: string): Promise<any | null> {
    const messageEntry = await this.messageEntryModel.findOne({
      where: { id },
      include: [
        {
          model: MessageEntryLeadData,
          include: [
            {
              model: SavedLead,
              attributes: ['id', 'leadData'],
            },
            {
              model: CompanyProduct,
            },
            {
              model: MessageStructure,
              include: [
                {
                  model: MessageTemplate,
                  attributes: ['language'],
                }
              ],
            },
          ],
        },
        {
          model: MessageScenario,
          include: [
            {
              model: User,
              attributes: ['id', 'companyId'],
            }
          ],
        },
      ],
    });

    if (!messageEntry) {
      throw new NotFoundException('Message entry not found');
    }

    if (
      messageEntry.type === MessageEntryType.FOLLOW_UP_EMAIL
      || messageEntry.type === MessageEntryType.LINKEDIN_FOLLOW_UP
    ) {

      const messageStructures = await this.messageStructureModel.findAll({
        where: {
          messageType: messageEntry.type,
        },
        include: [
          {
            model: MessageTemplate,
            attributes: ['language'],
          }
        ],
        attributes: ['id', 'name'],
      });

      const selectedMessageStructure = messageStructures.find((messageStructure) => {
        return messageStructure.id === messageEntry.messageEntryLeadData[0]?.messageStructureId;
      }) ?? null;

      return {
        messageStructure: selectedMessageStructure,
        messageStructures,
      };
    }

    const messageStructures = await this.messageStructureModel.findAll({
      where: {
        messageType: messageEntry.type,
      },
      include: [
        {
          model: MessageTemplate,
          attributes: ['language'],
        }
      ],
      attributes: ['id', 'name'],
    });

    const companyProducts = await this.companyProductModel.findAll({
      where: {
        companyId: messageEntry.messageScenario.user.companyId,
      },
      attributes: ['id', 'name'],
    });

    if (!messageEntry) {
      throw new NotFoundException('Message entry not found');
    }

    const plainMessageEntry = messageEntry.get({ plain: true });


    if ((plainMessageEntry as any).messageEntryLeadData) {
      (plainMessageEntry as any).messageEntryLeadData.forEach((leadData: any) => {
        const leadInfo = leadData.lead?.leadData;

        leadData.firstName = leadInfo?.first_name || null;
        leadData.lastname = leadInfo?.last_name || null;
        leadData.company = leadInfo?.current_positions?.[0]?.company || null;
        leadData.role = leadInfo?.current_positions?.[0]?.role || null;

        leadData.messageStructures = messageStructures;

        leadData.languages = leadData.messageStructure?.templates?.map((template) => template.language) || [];
        if (leadData.messageStructure) {
          delete leadData.messageStructure.templates;
        }

        leadData.companyProducts = companyProducts;

        delete leadData.lead;
      });
    }

    return plainMessageEntry;
  }

  async find(messageScenarioId: string): Promise<MessageEntry[]>  {
    const messageEntries = await this.messageEntryModel.findAll({
      where: { messageScenarioId },
    });
    return messageEntries;
  }

  async update(
    id: string,
    dto: UpdateMessageEntryReq,
  ): Promise<MessageEntry | null> {
    await this.findById(id);

    const { sendDate } = dto;
    let sendDateUtc: Date | null = null;

    if (sendDate) {
      sendDateUtc = moment.parseZone(sendDate).utc().toDate();
    }

    const messageEntry = await this.messageEntryModel.update({
      ...dto,
      sendDateUtc,
    }, {
      where: { id },
      returning: true,
    });

    return messageEntry[1][0];
  }

  async updateFollowUpStructure(
    id: string,
    dto: UpdateFollowUpEntryDto,
  ) {
    const messageEntry = await this.messageEntryModel.findOne({
      where: { id },
    });

    if (!messageEntry) {
      throw new NotFoundException('Message entry not found');
    }

    if (
      messageEntry.type !== MessageEntryType.FOLLOW_UP_EMAIL
      && messageEntry.type !== MessageEntryType.LINKEDIN_FOLLOW_UP
    ) {
      throw new BadRequestException('Message entry is not a follow up email or linkedin follow up');
    }

    await this.messageEntryLeadDataModel.update(
      { messageStructureId: dto.messageStructureId },
      { where: { messageEntryId: id } },
    );

    return messageEntry;
  }

  async remove(id: string): Promise<void> {
    await this.messageEntryModel.destroy({
      where: { id },
    });
    return;
  }

  async updateMessageEntryLeadData(
    leadId: string,
    dto: UpdateMessageEntryLeadDto,
  ): Promise<MessageEntry | null> {
    const messageEntryLeadData = await this.messageEntryLeadDataModel.findOne({
      where: { id: leadId },
    });

    if (!messageEntryLeadData) {
      throw new NotFoundException('Message entry lead data not found');
    }

    const { messageStructureId, productServiceId, ...rest } = dto;

    if (messageStructureId) {
      const messageStructure = await this.messageStructureService.findById(messageStructureId);
      messageEntryLeadData.messageStructureId = messageStructure.id;
    }

    if (productServiceId) {
      const productService = await this.companiesProductsService.findById(productServiceId);
      messageEntryLeadData.productServiceId = productService.id;
    }

    if (dto.email) messageEntryLeadData.email = dto.email;
    if (dto.phone) messageEntryLeadData.phone = dto.phone;
    if (dto.language) messageEntryLeadData.language = dto.language;
    if (dto.message) messageEntryLeadData.message = dto.message;
    if (dto.status) messageEntryLeadData.status = dto.status;

    await messageEntryLeadData.save();

    return await this.findById(messageEntryLeadData.messageEntryId);
  }

  /** Offline stand-in for BetterContact enrichment: derives contacts from the lead name and company domain. */
  private async fillMockContacts(
    messageEntriesLeadsData: MessageEntryLeadData[],
    leadsWithCompany: { leadId: string; leadData: SavedLead['leadData']; companyFullInfo: { website: string | null } }[],
    search: 'email' | 'phone',
  ) {
    const byLeadId = new Map(leadsWithCompany.map((item) => [item.leadId, item]));

    for (const messageEntryLeadData of messageEntriesLeadsData) {
      const item = byLeadId.get(messageEntryLeadData.leadId);
      if (!item) {
        continue;
      }

      if (search === 'email') {
        const domain = (item.companyFullInfo.website ?? 'example.com').replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '');
        const local = `${item.leadData.first_name}.${item.leadData.last_name}`
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-z.]/g, '');
        messageEntryLeadData.email = `${local}@${domain}`;
      } else {
        const digits = [...messageEntryLeadData.leadId.replace(/\D/g, '').padEnd(9, '0')].slice(0, 9).join('');
        messageEntryLeadData.phone = `+1 555 ${digits.slice(0, 3)} ${digits.slice(3, 7)}`;
      }

      await messageEntryLeadData.save();
    }
  }

  async bulkUpdateMessageEntryLeadData(dto: BulkUpdateMessageEntryLeadsDto): Promise<MessageEntry | null> {
    const { leadIds, ...changes } = dto;
    let messageEntry: MessageEntry | null = null;

    for (const leadId of leadIds) {
      messageEntry = await this.updateMessageEntryLeadData(leadId, changes);
    }

    return messageEntry;
  }

  async detectLeadLanguage(messageEntryLeadDataId: string): Promise<MessageEntry | null> {
    const messageEntryLeadData = await this.messageEntryLeadDataModel.findOne({
      where: { id: messageEntryLeadDataId },
      include: [SavedLead],
    });

    if (!messageEntryLeadData) {
      throw new NotFoundException('Message entry lead data not found');
    }

    const leadData = messageEntryLeadData.lead?.leadData;
    const location = [leadData?.location_country, leadData?.location, leadData?.current_positions?.[0]?.location]
      .filter(Boolean)
      .join(' ');

    messageEntryLeadData.language = detectLanguageFromLocation(location);
    await messageEntryLeadData.save();

    return await this.findById(messageEntryLeadData.messageEntryId);
  }

  async removeMessageEntryLeadsData(dto: MessageEntriesDataIdsDto) {
    await this.messageEntryLeadDataModel.destroy({
      where: { id: { [Op.in]: dto.messageEntryDataIds } },
    });
    return;
  }

  async getCsv(id: string, withEmails: boolean = false): Promise<string> {
    const messageEntry = await this.messageEntryModel.findOne({
      where: { id },
      include: [
        {
          model: MessageEntryLeadData,
          include: [
            {
              model: SavedLead,
              attributes: ['id', 'leadData'],
            },
            {
              model: CompanyProduct,
            },
          ],
        },
        {
          model: MessageScenario,
        },
      ],
    });

    if (!messageEntry || !messageEntry.messageEntryLeadData) {
      this.logger.warn(`Message entry with id ${id} not found or has no lead data for CSV export.`);
      return '';
    }

    const data = messageEntry.messageEntryLeadData.map((leadData) => {
      const leadInfo = leadData.lead?.leadData;
      const companyInfo = leadInfo?.current_positions?.[0];

      const parseLocation = (locationString: string | null | undefined): { city: string | null, country: string | null } => {
        if (!locationString) return { city: null, country: null };
        const parts = locationString.split(',').map(part => part.trim());
        const city = parts[0] || null;
        const country = parts.length > 1 ? parts[parts.length - 1] : null;
        return { city, country };
      };

      const { city, country } = parseLocation(leadInfo?.location);

      return {
        LeadLinkedInURL: leadInfo?.profile_url || null,
        LeadLocation: leadInfo?.location || null,
        LeadAccountName: companyInfo?.company || null,
        LeadAccountWebsite: null,
        LeadAccountLinkedInURL: null,
        LeadLinkedInUID: leadInfo?.member_urn || null,
        LeadAccountEmployees: null,
        LeadAccountLocationCity: city,
        LeadAccountLocationCountry: country,
      };
    });

    const csvStream = format({ headers: true });
    let csvData = '';

    const writableStream = new Writable({
        write(chunk, encoding, callback) {
            csvData += chunk.toString();
            callback();
        }
    });

    return new Promise((resolve, reject) => {
        writableStream.on('finish', () => resolve(csvData));
        writableStream.on('error', reject);

        csvStream.pipe(writableStream);
        data.forEach(row => csvStream.write(row));
        csvStream.end();
    });
  }

  async searchEmailOrPhone(
    dto: MessageEntriesDataIdsDto,
    search: 'email' | 'phone',
    userId: string,
  ): Promise<MessageEntry> {
    const accountId = await this.usersAccountsService.findLinkedinAccountId(userId);
    const betterContactApiKey = this.configService.get('BETTER_CONTACT_API_KEY');
    const betterContactWebhook = this.configService.get('BETTER_CONTACT_RESULT_WEBHOOK');

    const messageEntriesLeadsData = await this.messageEntryLeadDataModel.findAll({
      where: { id: { [Op.in]: dto.messageEntryDataIds } },
      include: [
        SavedLead,
      ],
    });

    const currentPositionsAndLeadIds = messageEntriesLeadsData.map((leadData) => {
      return {
        position: leadData.lead?.leadData?.current_positions?.[0],
        leadId: leadData.leadId,
        leadData: leadData.lead?.leadData,
      };
    });

    let leadsDataWithCompanyInfo = await Promise.all(currentPositionsAndLeadIds.map(async (leadData) => {
      const companyInfo = leadData.position;

      if (!companyInfo.company_id) {
        return;
      }

      const companyFullInfo = await this.linkedinProvider.getCompany(accountId, companyInfo.company_id);

      return {
        ...leadData,
        companyFullInfo,
      };
    }));

    leadsDataWithCompanyInfo = leadsDataWithCompanyInfo.filter((leadData) => leadData !== undefined);

    if (!betterContactApiKey) {
      await this.fillMockContacts(messageEntriesLeadsData, leadsDataWithCompanyInfo, search);
      return this.findById(messageEntriesLeadsData[0].messageEntryId);
    }

    const webhook = search === 'email'
      ? `${betterContactWebhook}/search-email-result`
      : `${betterContactWebhook}/search-phone-result`

    const body = {
      data: leadsDataWithCompanyInfo.map(({leadData, companyFullInfo, leadId}) => {
        return {
            first_name: leadData.first_name,
            last_name: leadData.last_name,
            company: leadData.current_positions[0]?.company,
            linkedin_url: leadData.public_profile_url,
            company_domain: companyFullInfo.website,
            custom_fields: {
              message_entry_id: messageEntriesLeadsData[0].messageEntryId,
              message_entry_lead_data_id: leadId,
            },
        };
      }),
      enrich_email_address: search === 'email',
      enrich_phone_number: search === 'phone',
      webhook,
    };

    const results = await firstValueFrom(
      this.httpService.post(
        `https://app.bettercontact.rocks/api/v2/async?api_key=${betterContactApiKey}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    return this.findById(messageEntriesLeadsData[0].messageEntryId);
  }

  async searchEmailResult(data: any): Promise<MessageEntry> {
    const transaction = await this.sequelize.transaction();

    const messageEntry = await this.messageEntryModel.findOne({
      where: {
        id: data.data[0].custom_fields.find((customField: any) => customField.name === 'message_entry_id').value,
      },
      include: [
        {
          model: MessageEntryLeadData,
        },
      ],
      transaction,
    });

    const updatePromises: Promise<[number]>[] = [];

    data.data.forEach((foundData) => {
      const messageEntryLeadDataId = foundData.custom_fields.find((customField: any) => customField.name === 'message_entry_lead_data_id').value;
      updatePromises.push(
        this.messageEntryLeadDataModel.update(
          { email: foundData.contact_email_address },
          {
            where: { leadId: messageEntryLeadDataId },
            transaction,
          },
        ),
      );
    });

    await Promise.all(updatePromises);
    await transaction.commit();

    this.eventEmitter.emit('MESSAGE_ENTRY_UPDATED')

    return await this.findById(messageEntry.id);
  }

  async searchPhoneResult(data: any): Promise<MessageEntry> {
    const transaction = await this.sequelize.transaction();

    const messageEntry = await this.messageEntryModel.findOne({
      where: {
        id: data.data[0].custom_fields.find((customField: any) => customField.name === 'message_entry_id').value,
      },
      include: [
        {
          model: MessageEntryLeadData,
        },
      ],
      transaction,
    });

    const updatePromises: Promise<[number]>[] = [];

    data.data.forEach((foundData) => {
      const messageEntryLeadDataId = foundData.custom_fields.find((customField: any) => customField.name === 'message_entry_lead_data_id').value;
      updatePromises.push(
        this.messageEntryLeadDataModel.update(
          { email: foundData.contact_phone_number },
          {
            where: { leadId: messageEntryLeadDataId },
            transaction,
          },
        ),
      );
    });

    await Promise.all(updatePromises);
    await transaction.commit();

    this.eventEmitter.emit('MESSAGE_ENTRY_UPDATED')

    return await this.findById(messageEntry.id);
  }

  async generateMessages(dto: MessageEntriesDataIdsDto, userId: string) {
    const messageEntryLeadsData = await this.messageEntryLeadDataModel.findAll({
      where: {
        id: {
          [Op.in]: dto.messageEntryDataIds,
        },
      },
      include: [
        {
          model: MessageStructure,
          include: [
            MessageTemplate,
          ]
        },
        CompanyProduct,
        SavedLead,
      ],
    });

    if (messageEntryLeadsData.length === 0) {
      throw new BadRequestException('No message entry leads data found');
    }

    for (const messageEntryLeadData of messageEntryLeadsData) {
      if (!messageEntryLeadData.messageStructure) {
        throw new BadRequestException(`Message structure is missing for message entry lead data ID: ${messageEntryLeadData.id}`);
      }

      if (!messageEntryLeadData.language) {
        throw new BadRequestException(`Language is missing for message entry lead data ID: ${messageEntryLeadData.id}`);
      }

      if (!messageEntryLeadData.productService) {
        throw new BadRequestException(`Product is missing for message entry lead data ID: ${messageEntryLeadData.id}`);
      }
    }

    await this.generateMessagesAndUpdateEntries(messageEntryLeadsData, userId);


    return await this.findById(messageEntryLeadsData[0].messageEntryId);
  }

  async sendMessages(
    dto: MessageEntriesDataIdsDto,
    user: User,
  ) {
    const messageEntryLeadsData = await this.messageEntryLeadDataModel.findAll({
      where: {
        id: {
          [Op.in]: dto.messageEntryDataIds,
        },
      },
      include: [
        {
          model: MessageStructure,
          include: [
            MessageTemplate,
          ],
        },
        SavedLead,
      ],
    });

    const userComapny = await this.companiesService.findById(user.companyId);
    const messageEntry = await this.messageEntryModel.findOne({
      where: {
        id: messageEntryLeadsData[0].messageEntryId,
      }
    });

    await this.protectMessageCampaignStart(messageEntry.messageScenarioId);

    await this.messageScenarioModel.update(
      {
        status: MessageScenarioStatus.IN_PROGRESS,
      }, {
        where: {
          id: messageEntry.messageScenarioId,
        }
      }
    );

    let firstMessageEntry: MessageEntry;

    firstMessageEntry = await this.messageEntryModel.findOne({
      where: {
        messageScenarioId: messageEntry.messageScenarioId,
        type: MessageEntryType.FIRST_EMAIL,
      },
      include: {
        model: MessageEntryLeadData,
      }
    });

    if (!firstMessageEntry) {
      firstMessageEntry = await this.messageEntryModel.findOne({
        where: {
          messageScenarioId: messageEntry.messageScenarioId,
          type: MessageEntryType.LINKEDIN_CONNECTION,
        },
        include: {
          model: MessageEntryLeadData,
        }
      });
    }


    const allMessageEntriesLeadsData = await this.messageEntryLeadDataModel.findAll({
      include: [
        {
          model: MessageEntry,
          required: true,
          include: [
            {
              model: MessageScenario,
              required: true,
              where: { id: messageEntry.messageScenarioId },
            },
          ],
        },
      ],
    });

    if (firstMessageEntry && firstMessageEntry.messageEntryLeadData && firstMessageEntry.messageEntryLeadData.length > 0) {
      const firstLeadDataMap = new Map();
      for (const fld of firstMessageEntry.messageEntryLeadData) {
        firstLeadDataMap.set(fld.leadId, fld);
      }
      for (const leadData of allMessageEntriesLeadsData) {
        const refLeadData = firstLeadDataMap.get(leadData.leadId);
        if (refLeadData) {
          leadData.productServiceId = refLeadData.productServiceId;
          leadData.language = refLeadData.language;
          leadData.email = refLeadData.email;
        }
        await leadData.save();
      }
    }

    if (!messageEntry.sendNow) {
      return;
    }

    if (messageEntry.type === MessageEntryType.FIRST_EMAIL) {
      messageEntryLeadsData.forEach(async(messageEntryLeadData) => {
        const messageTemplate = pickTemplate(messageEntryLeadData.messageStructure.templates, messageEntryLeadData.language);

        let subject;

        if (
          messageEntryLeadData.messageStructure.subjectType === MessageSubjectType.ACCOUNT_COMPANY ||
          !messageEntryLeadData.messageStructure.subjectType
        ) {
          subject = `${messageEntryLeadData.lead.leadData.current_positions[0].company} <> ${userComapny.name}`;
        }

        if (messageEntryLeadData.messageStructure.subjectType === MessageSubjectType.ACCOUNT_COMPANY_TEXT) {
          subject = `${messageEntryLeadData.lead.leadData.current_positions[0].company} <> ${userComapny.name} ${messageTemplate.subject}`;
        }

        if (messageEntryLeadData.messageStructure.subjectType === MessageSubjectType.TEXT) {
          subject = messageTemplate.subject;
        }

        this.messagesSendingQueue.add('sendMessage', {
          messageEntryLeadDataId: messageEntryLeadData.id,
          messageScenarioId: messageEntry.messageScenarioId,
          toEmail: messageEntryLeadData.email,
          message: messageEntryLeadData.message,
          userId: user.id,
          subject,
        });
      });
    }

    if (messageEntry.type === MessageEntryType.LINKEDIN_CONNECTION) {
      messageEntryLeadsData.forEach(async (messageEntryLeadData) => {
        this.messagesSendingQueue.add('sendLinkedinConnection', {
          toId: messageEntryLeadData.lead.leadData.id,
          message: messageEntryLeadData.message,
        });
      });
    }

    if (messageEntry.type === MessageEntryType.LINKEDIN_MESSAGE) {
      messageEntryLeadsData.forEach(async (messageEntryLeadData) => {
        this.messagesSendingQueue.add('sendLinkedinMessage', {
          toId: messageEntryLeadData.lead.leadData.id,
          message: messageEntryLeadData.message,
        });
      });
    }

    return;
  }

  async generateMessagesAndUpdateEntries(
    messageEntryLeadsData: MessageEntryLeadData[],
    userId: string,
  ) {
    const queueEvents = await this.getGenerationEvents();

    const transaction = await this.sequelize.transaction();
    const updatePromises: Promise<[number]>[] = [];
    const messageEntry = await this.messageEntryModel.findOne({
      where: {
        id: messageEntryLeadsData[0].messageEntryId,
      },
    });

    const jobs = await this.messagesGenerationQueue.addBulk(
      messageEntryLeadsData.map((messageEntryLeadData) => {
        return {
          name: 'generateMessage',
          data: {
            messageEntryLeadData,
            type: messageEntry.type,
            userId,
          },
          opts: { removeOnComplete: true },
        };
      }),
    );

    for (const job of jobs) {
      const result = await job.waitUntilFinished(queueEvents);

      messageEntryLeadsData.forEach((leadData, index) => {
        updatePromises.push(
          this.messageEntryLeadDataModel.update(
            { message: result, },
            {
              where: { id: job.data.messageEntryLeadData.id },
              transaction,
            }
          )
        );
      });
    }

    await Promise.all(updatePromises);
    await transaction.commit();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleMessagesSend() {
    const now = new Date();
    const utcYear = now.getUTCFullYear();
    const utcMonth = now.getUTCMonth();
    const utcDate = now.getUTCDate();
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();
    
    const startOfMinute = new Date(Date.UTC(utcYear, utcMonth, utcDate, utcHour, utcMinute, 0, 0));
    const endOfMinute = new Date(Date.UTC(utcYear, utcMonth, utcDate, utcHour, utcMinute, 59, 999));
    
    const messageEntries = await this.messageEntryModel.findAll({
      where: {
        sendDateUtc: {
          [Op.gte]: startOfMinute.toISOString(),
          [Op.lte]: endOfMinute.toISOString(),
        },
      },
      include: [
        {
          model: MessageScenario,
          required: true,
          where: {
            status: MessageScenarioStatus.IN_PROGRESS,
          },
        },
      ],
    });

    this.logger.log('Handle message send')
    this.logger.log(startOfMinute.toISOString());
    this.logger.log(endOfMinute.toISOString());

    this.logger.log('Message entries IDs to send')
    this.logger.log(messageEntries.map(entry => {
      return `ID: ${entry.id} - SendDate: ${entry.sendDate}`;
    }).join('\n'));

    for (const messageEntry of messageEntries) {
      const messageEntryLeadsData = await this.messageEntryLeadDataModel.findAll({
        where: { messageEntryId: messageEntry.id },
        include: [
            {
            model: MessageStructure,
            include: [
              {
                model: MessageTemplate,
              }
            ],
          },
          CompanyProduct,
          SavedLead,
        ],
      });

      for (const messageEntryLeadData of messageEntryLeadsData) {
        const user = await this.usersService.findById(messageEntry.messageScenario.userId);

        if (messageEntry.type === MessageEntryType.FIRST_EMAIL) {
          this.sendFirstEmail(messageEntry, messageEntryLeadData, user);
        }

        if (messageEntry.type === MessageEntryType.FOLLOW_UP_EMAIL) {
          this.sendFollowUpEmail(messageEntry, messageEntryLeadData, user);
        }

        if (messageEntry.type === MessageEntryType.LINKEDIN_CONNECTION) {
          this.sendLinkedinConnection(messageEntryLeadData, user);
        }

        if (messageEntry.type === MessageEntryType.LINKEDIN_MESSAGE) {
          this.sendLinkedinMessage(messageEntryLeadData, user);
        }

        if (messageEntry.type === MessageEntryType.LINKEDIN_FOLLOW_UP) {
          this.sendLinkedinFollowUp(messageEntryLeadData, user);
        }
      }
    }
  }

  async sendFirstEmail(
    messageEntry: MessageEntry,
    messageEntryLeadData: MessageEntryLeadData,
    user: User,
  ) {
    const userComapny = await this.companiesService.findById(user.companyId);

    const messageTemplate = pickTemplate(messageEntryLeadData.messageStructure.templates, messageEntryLeadData.language);

    let subject;

    if (
      messageEntryLeadData.messageStructure.subjectType === MessageSubjectType.ACCOUNT_COMPANY
      || !messageEntryLeadData.messageStructure.subjectType
    ) {
      subject = `${messageEntryLeadData.lead.leadData.current_positions?.[0].company} <> ${userComapny.name}`;
    }

    if (messageEntryLeadData.messageStructure.subjectType === MessageSubjectType.ACCOUNT_COMPANY_TEXT) {
      subject = `${messageEntryLeadData.lead.leadData.current_positions?.[0].company} <> ${userComapny.name} ${messageTemplate.subject}`;
    }

    if (messageEntryLeadData.messageStructure.subjectType === MessageSubjectType.TEXT) {
      subject = messageTemplate.subject;
    }

    this.messagesSendingQueue.add('sendMessage', {
      messageEntryLeadDataId: messageEntryLeadData.id,
      messageScenarioId: messageEntry.messageScenarioId,
      toEmail: messageEntryLeadData.email,
      message: messageEntryLeadData.message,
      userId: user.id,
      subject,
    });
  }

  async sendFollowUpEmail(
    messageEntry: MessageEntry,
    messageEntryLeadData: MessageEntryLeadData,
    user: User,
  ) {
    const userComapny = await this.companiesService.findById(user.companyId);

    const messageTemplate = pickTemplate(messageEntryLeadData.messageStructure.templates, messageEntryLeadData.language);

    let subject;

    if (
      messageEntryLeadData.messageStructure.subjectType === MessageSubjectType.ACCOUNT_COMPANY
      || !messageEntryLeadData.messageStructure.subjectType
    ) {
      subject = `${messageEntryLeadData.lead.leadData?.current_positions?.[0].company} <> ${userComapny.name}`;
    }

    if (messageEntryLeadData.messageStructure.subjectType === MessageSubjectType.ACCOUNT_COMPANY_TEXT) {
      subject = `${messageEntryLeadData.lead.leadData?.current_positions?.[0].company} <> ${userComapny.name} ${messageTemplate.subject}`;
    }

    if (messageEntryLeadData.messageStructure.subjectType === MessageSubjectType.TEXT) {
      subject = messageTemplate.subject;
    }

    const job = await this.messagesGenerationQueue.add('generateMessage', {
        messageEntryLeadData,
        type: messageEntry.type,
        userId: user.id,
      },
      { removeOnComplete: true },
    );

    const queueEvents = await this.getGenerationEvents();

    const result = await job.waitUntilFinished(queueEvents);

    await this.messageEntryLeadDataModel.update(
      { message: result },
      {
        where: { id: messageEntryLeadData.id },
      },
    );

    this.messagesSendingQueue.add('sendMessage', {
      messageEntryLeadDataId: messageEntryLeadData.id,
      messageScenarioId: messageEntry.messageScenarioId,
      toEmail: messageEntryLeadData.email,
      message: messageEntryLeadData.message,
      userId: user.id,
      subject,
    });
  }

  async sendLinkedinConnection(
    messageEntryLeadData: MessageEntryLeadData,
    user: User,
  ) {
    this.messagesSendingQueue.add('sendLinkedinConnection', {
      toId: messageEntryLeadData.lead.leadData.id,
      message: messageEntryLeadData.message,
      userId: user.id,
    });
  }

  async sendLinkedinMessage(
    messageEntryLeadData: MessageEntryLeadData,
    user: User,
  ) {
    this.messagesSendingQueue.add('sendLinkedinMessage', {
      toId: messageEntryLeadData.lead.leadData.id,
      message: messageEntryLeadData.message,
      userId: user.id,
    });
  }

  async sendLinkedinFollowUp(
    messageEntryLeadData: MessageEntryLeadData,
    user: User,
  ) {
    this.messagesSendingQueue.add('sendLinkedinMessage', {
      toId: messageEntryLeadData.lead.leadData.id,
      message: messageEntryLeadData.message,
      userId: user.id,
    });
  }

  async protectMessageCampaignStart(messageScenarioId: string) {
    const messageScenario = await this.messageScenarioModel.findOne({
      where: { id: messageScenarioId },
    });

    const userConnectedAccounts = await this.usersAccountsService.findConnectedAccounts(messageScenario.userId);

    const messageEntries = await this.messageEntryModel.findAll({
      include: [
        {
          model: MessageScenario,
          required: true,
          where: {
            id: messageScenarioId,
          },
        },
      ],
    });

    for (const messageEntry of messageEntries) {
      if (
        (
          messageEntry.type === MessageEntryType.FIRST_EMAIL ||
          messageEntry.type === MessageEntryType.FOLLOW_UP_EMAIL
        ) && userConnectedAccounts.email === null
      ) {
        throw new BadRequestException('Unable to launch message campaign, no email is connected');
      }

      if (
        (
          messageEntry.type === MessageEntryType.LINKEDIN_CONNECTION ||
          messageEntry.type === MessageEntryType.LINKEDIN_MESSAGE ||
          messageEntry.type === MessageEntryType.LINKEDIN_FOLLOW_UP
        ) && userConnectedAccounts.linkedin === false
      ) {
        throw new BadRequestException('Unable to launch message campaign, Linkedin is not connected');
      }
    }
  }
}
