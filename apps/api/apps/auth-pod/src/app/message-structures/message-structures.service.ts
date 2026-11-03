import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MessageEntry, MessageEntryLeadData, MessageScenario, MessageScenarioStatus, MessageStructure, MessageTemplate, User } from '@willbe-server/db-core';
import { CreateMessageStructureReq } from './dto/create-message-structure.dto';
import { UpdateMessageStructureReq } from './dto/update-message-structure.dto';
import { FindMessageStructureDto } from './dto/find-message-structure.dto';
import { MessageTemplatesService } from './message-templates.service';
import { FindOptions, Attributes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import ISO6391 from 'iso-639-1';
import { compareSync } from 'bcrypt';

@Injectable()
export class MessageStructuresService {
  constructor(
    @InjectModel(MessageStructure)
    private readonly messageStructureModel: typeof MessageStructure,
    @InjectModel(MessageTemplate)
    private readonly messageTemplateModel: typeof MessageTemplate,
    @InjectModel(MessageScenario)
    private readonly messageScenarioModel: typeof MessageScenario,
  ) {}

  async create(
    dto: CreateMessageStructureReq,
    userId: string,
  ): Promise<MessageStructure> {
    const messageStructure = await this.messageStructureModel.create({
      ...dto,
      userId,
    });
    
    return await this.findById(messageStructure.id);
  }

  async clone(structureId: string, newUserId: string) {
    const messageStructure = await this.messageStructureModel.findOne({
      where: {
        id: structureId,
      },
      include: [MessageTemplate],
    });

    if (!messageStructure) {
      throw new NotFoundException('Message structure not found');
    }

    const {
      id,
      name,
      createdAt,
      updatedAt,
      templates,
      userId,
      ...messageStructureData
    } = messageStructure.dataValues;

    const newMessageStructure = await this.messageStructureModel.create({
      ...messageStructureData,
      name: `Copy of ${name}`,
      userId: newUserId,
    });

    const messageTemplatesData = messageStructure.templates.map((template) => {
      const { id, createdAt, updatedAt, ...rest } = template.dataValues;
      rest.messageStructureId = newMessageStructure.id;
      return rest;
    });

    await this.messageTemplateModel.bulkCreate(messageTemplatesData);
    return await this.findById(newMessageStructure.id);
  }

  async find(
    dto: FindMessageStructureDto = {},
    companyId: string,
  ): Promise<MessageStructure[]> {
    const query: FindOptions<Attributes<MessageStructure>> = {};

    if (dto?.name) {
      query.where = Sequelize.literal(`LOWER(name) LIKE '%${dto.name.toLowerCase()}%'`);
    }

    if (dto?.limit) {
      query.limit = dto.limit;
    }

    if (dto?.offset) {
      query.offset = dto.offset;
    }

    const messageStructures = await this.messageStructureModel.findAll({
      ...query,
      include: [
        {
          model: User,
          required: true,
          attributes: ['firstName', 'lastName'],
          where: {
            companyId,
          }
        },
        {
          model: MessageTemplate,
          attributes: ['language'],
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    const result = messageStructures.map((messageStructure) => {
      const { templates, ...rest } = messageStructure.dataValues;
      return {
        ...rest,
        languages: templates.map((template) => ISO6391.getName(template.language)),
      };
    });

    return result as MessageStructure[];
  }

  async findById(id: string): Promise<MessageStructure | null> {
    const messageStructure = await this.messageStructureModel.findOne({
      where: {
        id,
      },
      include: [
        {
          model: User,
          required: true,
          attributes: ['firstName', 'lastName'],
        },
        {
          model: MessageTemplate,
          attributes: ['language'],
        },
      ],
    });

    if (!messageStructure) {
      throw new NotFoundException('Message structure not found');
    }

    const { templates, ...rest } = messageStructure.dataValues;
    const result = {
      ...rest,
      languages: templates.map((template) => ISO6391.getName(template.language)),
    };

    return result as MessageStructure;
  }

  async update(
    id: string,
    dto: UpdateMessageStructureReq,
  ): Promise<MessageStructure | null> {
    await this.findById(id);

    await this.messageStructureModel.update(dto, {
      where: {
        id,
      },
      returning: true,
    });

    return await this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const isMessageStructureUsed = await this.isMessageStructureUsed(id);

    if (isMessageStructureUsed) {
      throw new BadRequestException('Message structure cannot be removed because it is used in the ongoing message scenario');
    }

    await this.messageStructureModel.destroy({
      where: { id },
    });
    return;
  }

  async isMessageStructureUsed(id: string): Promise<boolean> {
    const count = await this.messageScenarioModel.count({
      where: {
        status: MessageScenarioStatus.IN_PROGRESS,
      },
      include: [
        {
          model: MessageEntry,
          required: true,
          include: [
            {
              model: MessageEntryLeadData,
              where: {
                messageStructureId: id,
              },
            },
          ],
        }
      ],
    });

    return count > 0;
  }
}
