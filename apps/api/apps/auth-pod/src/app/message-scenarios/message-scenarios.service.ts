import { InjectModel } from '@nestjs/sequelize';
import {
  MessageEntry,
  MessageEntryLeadData,
  MessageScenario,
  MessageScenarioStatus,
  SavedLead,
  SentEmailMessage,
  SentMessageStatus,
  User,
  ReceivedMessage,
  MessageStructure,
  LeadMessageStatus,
  LeadCampaignStatus,
} from '@willbe-server/db-core';
import { FindLeadsRes } from '@willbe-server/db-core';
import { CreateMessageScenarioReq } from './dto/create-message-scenario.dto';
import { Logger, NotFoundException } from '@nestjs/common';
import { AddLeadsToMessageScenarioReq } from './dto/add-leads.dto';
import { UpdateMessageScenarioReq } from './dto/update-message-scenario.dto';
import { FindMessageScenariosDto } from './dto/find-message-scenarios.dto';
import { Attributes, FindOptions, Op, QueryTypes, Sequelize } from 'sequelize';
import { MessageScenariosIdsDto } from './dto/message-scenarios-ids.dto';
import { LeadScenariosService } from '../lead-scenarios/lead-scenarios.service';
import { CreateMessageScenarioWithLeadsReq } from './dto/create-message-scenario-with-leads.dto';

export class MessageScenariosService {
  private readonly logger = new Logger(MessageScenariosService.name);
  constructor(
    @InjectModel(MessageScenario)
    private readonly messageScenarioModel: typeof MessageScenario,
    @InjectModel(MessageEntryLeadData)
    private readonly messageEntryLeadDataModel: typeof MessageEntryLeadData,
    @InjectModel(MessageEntry)
    private readonly messageEntryModel: typeof MessageEntry,
    @InjectModel(SentEmailMessage)
    private readonly sentEmailMessageModel: typeof SentEmailMessage,
    @InjectModel(ReceivedMessage)
    private readonly receivedMessageModel: typeof ReceivedMessage,
    private readonly leadScenariosService: LeadScenariosService,
  ) {}

  async create(
    dto: CreateMessageScenarioReq,
    userId: string,
  ): Promise<MessageScenario | null> {
    const messageScenario = await this.messageScenarioModel.create({
      name: dto.name,
      status: MessageScenarioStatus.NOT_STARTED,
      userId
    });

    return messageScenario;
  }
  
  async createWithLeads(
    dto: CreateMessageScenarioWithLeadsReq,
    userId: string,
  ) {
    const leadScenario = await this.leadScenariosService.findById(dto.leadScenarioId);

    const messageScenario = await this.messageScenarioModel.create(
      {
        name: leadScenario.name,
        status: MessageScenarioStatus.NOT_STARTED,
        userId,
      },
      {
      include: [
          {
            model: MessageEntry,
          },
          {
            model: SavedLead,
          },
        ],
      },
    );

    await messageScenario.$add('leads', dto.leadsIds);

    return await this.findById(messageScenario.id);
  }

  async update(
    id: string,
    dto: UpdateMessageScenarioReq,
  ): Promise<MessageScenario | null> {
    await this.findById(id);

    const updateMessageScenarioResult = await this.messageScenarioModel.update(dto, {
      where: { id },
      returning: true,
    });

    return updateMessageScenarioResult[1][0];
  }

  async addLeadsToMessageScenario(
    messageScenarioId: string,
    dto: AddLeadsToMessageScenarioReq,
  ): Promise<MessageScenario | null> {
    const messageScenario = await this.messageScenarioModel.findOne({
      where: { id: messageScenarioId },
      include: [
        {
          model: MessageEntry,
        },
        {
          model: SavedLead,
        },
      ],
    });

    if (!messageScenario) {
      throw new NotFoundException('Message scenario not found');
    }

    if (messageScenario?.messageEntries.length > 0) {
      const associationsToCreate = [];

      messageScenario.messageEntries.forEach((messageEntry) => {
        if (messageEntry.id && dto.leadsIds && dto.leadsIds.length > 0) {
          dto.leadsIds.forEach((leadId) => {
            associationsToCreate.push({
              messageEntryId: messageEntry.id, 
              leadId: leadId,
            });
          });
        }
      });

      await this.messageEntryLeadDataModel.bulkCreate(associationsToCreate);
    }

    await messageScenario.$add('leads', dto.leadsIds);

    return await this.findById(messageScenarioId);
  }

  async removeLeadFromMessageScenario(
    messageScenarioId: string,
    dto: AddLeadsToMessageScenarioReq,
  ): Promise<MessageScenario | null> {
    const messageScenario = await this.messageScenarioModel.findOne({
      where: { id: messageScenarioId },
      include: [
        {
          model: MessageEntry,
        },
        {
          model: SavedLead,
        },
      ],
    });

    if (!messageScenario) {
      throw new NotFoundException('Message scenario not found');
    }

    if (messageScenario?.messageEntries.length > 0) {
      const associationsIdsToDelete = [];

      messageScenario.messageEntries.forEach((messageEntry) => {
        associationsIdsToDelete.push(messageEntry.id);
      });

      await this.messageEntryLeadDataModel.destroy({
        where: {
          leadId: {
            [Op.in]: dto.leadsIds,
          },
          messageEntryId: {
            [Op.in]: associationsIdsToDelete,
          },
        },
      });
    }

    await messageScenario.$remove('leads', dto.leadsIds);

    return await this.findById(messageScenarioId);
  }

  async findById(id: string): Promise<MessageScenario | null> {
    const messageScenario = await this.messageScenarioModel.findOne({
      where: { id },
      include: ['leads'],
    });

    if (!messageScenario) {
      throw new NotFoundException('Message scenario not found');
    }

    return messageScenario;
  }

  async find(
    dto: FindMessageScenariosDto = {},
    user: User,
  ) {

    const query: FindOptions<Attributes<MessageScenario>> = {};
    
    if (dto?.name) {
      const pattern = this.messageScenarioModel.sequelize.escape(`%${dto.name.toLowerCase()}%`);

      query.where = {
        [Op.or]: [
          Sequelize.literal(`LOWER(name) LIKE ${pattern}`),
          
          Sequelize.literal(`EXISTS (
            SELECT 1 FROM "saved_leads" as "leads" 
            WHERE 
              "leads"."id" IN (
                SELECT "message_scenarios_leads"."lead_id" 
                FROM "message_scenarios_leads" 
                WHERE "message_scenarios_leads"."message_scenario_id" = "MessageScenario"."id"
              )
              AND (
                LOWER("leads"."lead_data"->>'first_name') LIKE ${pattern} 
                OR LOWER("leads"."lead_data"->>'last_name') LIKE ${pattern}
                OR LOWER(CONCAT("leads"."lead_data"->>'first_name', ' ', "leads"."lead_data"->>'last_name')) LIKE ${pattern}
              )
          )`),
          
          Sequelize.literal(`EXISTS (
            SELECT 1 FROM "saved_leads" as "leads" 
            WHERE 
              "leads"."id" IN (
                SELECT "message_scenarios_leads"."lead_id" 
                FROM "message_scenarios_leads" 
                WHERE "message_scenarios_leads"."message_scenario_id" = "MessageScenario"."id"
              )
              AND (
                EXISTS (
                  SELECT 1
                  WHERE LOWER("leads"."lead_data"->'current_positions'->0->>'company') LIKE ${pattern}
                )
              )
          )`),
        ],
      };
    }

    if (dto?.limit) {
      query.limit = dto.limit;
    }

    if (dto?.offset) {
      query.offset = dto.offset;
    }

    const messageScenarios = await this.messageScenarioModel.findAll({
      ...query,
      include: [
        {
          model: User,
          required: true,
          attributes: ['firstName', 'lastName'],
          where: { companyId: user.companyId },
        },
        {
          model: SavedLead,
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    const metrics = await this.findScenarioMetrics(messageScenarios.map((messageScenario) => messageScenario.id));

    return messageScenarios.map((messageScenario) => {
      const { leads, ...rest } = messageScenario.dataValues;
      const scenarioMetrics = metrics.get(messageScenario.id);
      const sent = scenarioMetrics?.sent ?? 0;
      const rate = (value = 0) => (sent > 0 ? parseFloat(((value / sent) * 100).toFixed(1)) : 0);

      return {
        ...rest,
        leadsInCadence: leads.length,
        messagesSent: sent,
        responseRate: rate(scenarioMetrics?.responded),
        meetingRate: rate(scenarioMetrics?.meetings),
        bounceRate: rate(scenarioMetrics?.bounced),
        outOfOfficeRate: rate(scenarioMetrics?.outOfOffice),
      };
    });
  }

  private async findScenarioMetrics(scenarioIds: string[]) {
    const metrics = new Map<string, { sent: number; responded: number; bounced: number; outOfOffice: number; meetings: number }>();
    if (!scenarioIds.length) {
      return metrics;
    }

    const rows = await this.messageScenarioModel.sequelize.query<{
      id: string; sent: string; responded: string; bounced: string; outOfOffice: string; meetings: string;
    }>(
      `
      SELECT ms.id,
        (SELECT COUNT(*) FROM sent_email_messages sem WHERE sem.message_scenario_id = ms.id) AS sent,
        (SELECT COUNT(*) FROM sent_email_messages sem WHERE sem.message_scenario_id = ms.id AND sem.status = 'responded') AS responded,
        (SELECT COUNT(*) FROM sent_email_messages sem WHERE sem.message_scenario_id = ms.id AND sem.status = 'bounced') AS bounced,
        (SELECT COUNT(*) FROM sent_email_messages sem WHERE sem.message_scenario_id = ms.id AND sem.status = 'out_of_office') AS "outOfOffice",
        (SELECT COUNT(DISTINCT meld.lead_id)
           FROM message_entries_leads_data meld
           JOIN message_entries me ON me.id = meld.message_entry_id
          WHERE me.message_scenario_id = ms.id AND meld.status = 'meeting') AS meetings
      FROM message_scenarios ms
      WHERE ms.id IN (:scenarioIds)
      `,
      { type: QueryTypes.SELECT, replacements: { scenarioIds } },
    );

    for (const row of rows) {
      metrics.set(row.id, {
        sent: Number(row.sent),
        responded: Number(row.responded),
        bounced: Number(row.bounced),
        outOfOffice: Number(row.outOfOffice),
        meetings: Number(row.meetings),
      });
    }
    return metrics;
  }

  async removeMessageScenarios(dto: MessageScenariosIdsDto): Promise<void> {
    await this.messageScenarioModel.destroy({
      where: {
        id: {
          [Op.in]: dto.messageScenariosIds,
        },
      },
    });
    return;
  }


  async getScenarioStatistics(scenarioId: string) {
    const sentMessages = await this.sentEmailMessageModel.findAll({
      where: {
        messageScenarioId: scenarioId,
      },
    });

    const totalSent = sentMessages.length;
    const bounced = sentMessages.filter(msg => msg.status === SentMessageStatus.BOUNCED).length;
    const replied = sentMessages.filter(msg => msg.status === SentMessageStatus.RESPONDED).length;
    const outOfOffice = sentMessages.filter(msg => msg.status === SentMessageStatus.OUT_OF_OFFICE).length;
    
    const meetings = await this.messageEntryLeadDataModel.count({
      distinct: true,
      col: 'lead_id',
      where: { status: LeadCampaignStatus.MEETING },
      include: [{ model: MessageEntry, required: true, where: { messageScenarioId: scenarioId } }],
    });

    const bounceRate = totalSent > 0 ? (bounced / totalSent) * 100 : 0;
    const responseRate = totalSent > 0 ? (replied / totalSent) * 100 : 0;
    const meetingRate = totalSent > 0 ? (meetings / totalSent) * 100 : 0;
    const outOfOfficeRate = totalSent > 0 ? (outOfOffice / totalSent) * 100 : 0;
    
    return {
      totalSent,
      bounced,
      replied,
      bounceRate: parseFloat(bounceRate.toFixed(2)),
      responseRate: parseFloat(responseRate.toFixed(2)),
      meetingRate: parseFloat(meetingRate.toFixed(2)),
      outOfOfficeRate: parseFloat(outOfOfficeRate.toFixed(2)),
    };
  }

  async getMessages(scenarioId: string) {
    const sentMessages = await this.sentEmailMessageModel.findAll({
      where: {
        messageScenarioId: scenarioId,
      },
      include: [{
        model: MessageEntryLeadData,
        as: 'messageEntryLeadData',
        required: true,
        include: [{
          model: SavedLead,
          as: 'lead',
          required: true,
        }],
      }],
      order: [['sentAt', 'ASC']],
    });

    const receivedMessages = await this.receivedMessageModel.findAll({
      include: [{
        model: SentEmailMessage,
        as: 'sentEmailMessage',
        required: true,
        where: {
          messageScenarioId: scenarioId,
        },
        include: [{
          model: MessageEntryLeadData,
          as: 'messageEntryLeadData',
          required: true,
          include: [{
            model: SavedLead,
            as: 'lead',
            required: true,
          }],
        }],
      }],
    });

    console.log('__receivedMessages');
    console.log(receivedMessages);

    const messagesByLead = new Map<string, { lead: SavedLead, sentMessages: SentEmailMessage[], receivedMessages: ReceivedMessage[] }>();

    for (const sentMsg of sentMessages) {
      const lead = sentMsg.messageEntryLeadData?.lead;
      if (lead) {
        if (!messagesByLead.has(lead.id)) {
          messagesByLead.set(lead.id, { lead, sentMessages: [], receivedMessages: [] });
        }
        messagesByLead.get(lead.id)?.sentMessages.push(sentMsg);
      }
    }

    for (const receivedMsg of receivedMessages) {
      const lead = receivedMsg.sentEmailMessage?.messageEntryLeadData?.lead;
      if (lead) {
        if (!messagesByLead.has(lead.id)) {
          messagesByLead.set(lead.id, { lead, sentMessages: [], receivedMessages: [] });
        }
        messagesByLead.get(lead.id)?.receivedMessages.push(receivedMsg);
      }
    }

    
    const result = Array.from(messagesByLead.values()).map(entry => {
      const simplifiedSentMessages = entry.sentMessages.map(msg => {
        const plainMsg: any = msg.get({ plain: true });
        const messageFromLeadData = plainMsg.messageEntryLeadData?.message;
        delete plainMsg.messageEntryLeadData;
        plainMsg.message = messageFromLeadData || null;
        return plainMsg as SentEmailMessage & { message?: string };
      });

      const simplifiedReceivedMessages = entry.receivedMessages.map(msg => {
        const plainMsg: any = msg.get({ plain: true });
        delete plainMsg.sentEmailMessage;
        return plainMsg as ReceivedMessage;
      });

      const status = entry.receivedMessages.length > 0 
      ? LeadMessageStatus.RESPONDED 
      : LeadMessageStatus.NOT_ANSWERED;

    return {
      ...(entry.lead.get({ plain: true })),
      sentMessages: simplifiedSentMessages,
      receivedMessages: simplifiedReceivedMessages,
      status,
      isRead: entry.receivedMessages.length > 0,
    };
    });

    return result;
  }

  async getCadenceTimeframe(scenarioId: string) {
    const sentMessages = await this.sentEmailMessageModel.findAll({
      where: {
        messageScenarioId: scenarioId,
      },
      include: [{
        model: MessageEntryLeadData,
        include: [{
          model: SavedLead,
          as: 'lead'
        }],
      }],
    });

    const messageEntries = await this.messageEntryModel.findAll({
      where: {
        messageScenarioId: scenarioId,
      },
      include: [{
        model: MessageEntryLeadData,
        include: [{
          model: MessageStructure,
        }],
      }],
      order: [['sendDate', 'ASC']],
    });

    const formattedEntries = messageEntries.map((entry, index) => {
      const entrySentMessages = sentMessages.filter(msg => 
        msg.messageEntryLeadData.messageEntryId === entry.id
      );

      const totalSent = entrySentMessages.length;
      const bounced = entrySentMessages.filter(msg => msg.status === SentMessageStatus.BOUNCED).length;
      const replied = entrySentMessages.filter(msg => msg.status === SentMessageStatus.RESPONDED).length;
      const outOfOffice = entrySentMessages.filter(msg => msg.status === SentMessageStatus.OUT_OF_OFFICE).length;

      const bounceRate = totalSent > 0 ? (bounced / totalSent) * 100 : 0;
      const responseRate = totalSent > 0 ? (replied / totalSent) * 100 : 0;
      const outOfOfficeRate = totalSent > 0 ? (outOfOffice / totalSent) * 100 : 0;
      const meetingRate = 0;

      return {
        id: entry.id,
        cadenceType: entry.type,
        structure: entry.messageEntryLeadData[index]?.messageStructure?.name ?? null,
        mailsSent: totalSent,
        meetingRate: parseFloat(meetingRate.toFixed(2)),
        responseRate: parseFloat(responseRate.toFixed(2)),
        outOfOfficeRate: parseFloat(outOfOfficeRate.toFixed(2)),
        bounceRate: parseFloat(bounceRate.toFixed(2)),
        dateToBeSent: entry.sendDate,
        isSent: totalSent > 0,
      };
    });

    return formattedEntries;
  }

  async getLeadsInCadence(scenarioId: string) {
    let leads: any = await this.messageEntryLeadDataModel.findAll({
      include: [{
        model: MessageEntry,
        where: {
          messageScenarioId: scenarioId,
        },
      },
      {
        model: SavedLead,
        as: 'lead'
      },
    ],
    });

    leads = leads.reduce((acc, current) => {
      const x = acc.find(item => item.leadId === current.leadId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    leads = leads.map((lead) => {
      return {
        ...lead.dataValues,
        messageEntry: lead.messageEntry.dataValues,
      };
    });
    
    return leads;
  }

  private escapeCsvValue(value: any): string {
    if (value === null || typeof value === 'undefined') {
      return '';
    }
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  async getCsv(
    scenarioId: string,
    withEmails: boolean = false,
  ): Promise<string> {
    const messageScenario = await this.messageScenarioModel.findOne({
      where: { id: scenarioId },
      include: [
        {
          model: SavedLead,
          as: 'leads',
          required: false,
        },
      ],
    });

    if (!messageScenario) {
      throw new NotFoundException(`Message scenario with ID ${scenarioId} not found.`);
    }

    const leads: SavedLead[] = messageScenario.leads || [];
    const leadIds = leads.map(lead => lead.id);

    const leadDataEntries = await this.messageEntryLeadDataModel.findAll({
      where: {
        leadId: { [Op.in]: leadIds }
      },
      include: [{
        model: MessageEntry,
        required: true,
        where: { messageScenarioId: scenarioId },
        attributes: [],
      }],
      group: ['MessageEntryLeadData.id', 'MessageEntryLeadData.lead_id'], 
    });

    const leadDataMap = new Map<string, MessageEntryLeadData>();
    leadDataEntries.forEach(entry => {
      if (entry.leadId && !leadDataMap.has(entry.leadId)) {
        leadDataMap.set(entry.leadId, entry);
      }
    });

    let leadsToExport = leads;
    if (withEmails) {
      leadsToExport = leads.filter(lead => {
        const entryData = leadDataMap.get(lead.id);
        return entryData && entryData.email;
      });
    }

    const headers = [
      'LeadFirstName', 'LeadLastName', 'LeadPosition', 'LeadEmail', 'LeadPhone',
      'LeadLinkedInURL', 'LeadLocation', 'LeadAccountName', 'LeadAccountWebsite',
      'LeadAccountLinkedInURL', 'LeadLinkedInUID', 'LeadAccountEmployees',
      'LeadAccountLocationCity', 'LeadAccountLocationCountry',
    ];

    const rows = leadsToExport.map(lead => {
      const leadData = lead.leadData as FindLeadsRes;
      const currentPosition: any = leadData?.current_positions?.[0];
      const entryData = leadDataMap.get(lead.id);

      return [
        leadData?.first_name,
        leadData?.last_name,
        leadData?.headline,
        entryData?.email,
        entryData?.phone,
        leadData?.public_profile_url,
        leadData?.location,
        currentPosition?.['company_name'],
        null,
        currentPosition?.['company_public_profile_url'],
        leadData?.public_identifier,
        null,
        null,
        null,
      ].map(this.escapeCsvValue);
    });

    const headerString = headers.map(this.escapeCsvValue).join(',');
    const rowsString = rows.map(row => row.join(',')).join('\n');

    return `${headerString}\n${rowsString}`;
  }
}
