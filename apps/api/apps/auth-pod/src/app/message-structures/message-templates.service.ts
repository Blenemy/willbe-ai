import { InjectModel } from '@nestjs/sequelize';
import { MessageStructure, MessageTemplate } from '@willbe-server/db-core';
import { MessageStructuresService } from './message-structures.service';
import { CreateMessageTemplateReq } from './dto/create-message-template.dto';
import { UpdateMessageTemplateReq } from './dto/update-message-template.dto';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { FindMessageTemplateDto } from './dto/find-message-template.dto';
import { Translate } from '@google-cloud/translate/build/src/v2';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';

export class MessageTemplatesService {
  private readonly logger = new Logger(MessageTemplatesService.name);
  private readonly translate: Translate | null;

  constructor(
    @InjectModel(MessageTemplate)
    private readonly messageTemplateModel: typeof MessageTemplate,
    private readonly messageStructureService: MessageStructuresService,
    private readonly configService: ConfigService,
    private readonly sequelize: Sequelize,
  ) {
    const translateApiKey = this.configService.get('GOOGLE_TRANSLATE_API_KEY');
    this.translate = translateApiKey ? new Translate({ key: translateApiKey }) : null;
    if (!this.translate) {
      this.logger.warn('GOOGLE_TRANSLATE_API_KEY is not set, templates are copied without translation');
    }
  }

  private async translateText<T extends string | string[]>(text: T, language: string): Promise<[T]> {
    if (!this.translate) {
      return [text];
    }
    const [translation] = await this.translate.translate(text as string & string[], language);
    return [translation as T];
  }

  async create(dto: CreateMessageTemplateReq) {
    await this.messageStructureService.findById(dto.messageStructureId);

    let messageTemplate = await this.messageTemplateModel.findOne({
      where: {
        messageStructureId: dto.messageStructureId,
        language: dto.language,
      },
    });

    if (messageTemplate) {
      throw new BadRequestException('Message template already exists for this language');
    }

    messageTemplate = await this.messageTemplateModel.create({
      ...dto,
    });

    return messageTemplate;
  }

  async createFromExisting(dto: CreateMessageTemplateReq) {
    await this.messageStructureService.findById(dto.messageStructureId);

    const [existingTemplate, templateToTranslate] = await Promise.all([
      this.messageTemplateModel.findOne({
        where: {
          messageStructureId: dto.messageStructureId,
          language: dto.language,
        },
      }),
      this.messageTemplateModel.findOne({
        where: {
          messageStructureId: dto.messageStructureId,
          language: dto?.translateFromLanguage,
        },
      })
    ]);

    if (existingTemplate) {
      throw new BadRequestException('Message template already exists for this language');
    }

    if (!templateToTranslate) {
      throw new NotFoundException('Message template specified for translate not found');
    }

    const transaction = await this.sequelize.transaction();

    const newTemplate = await this.messageTemplateModel.create({
      messageStructureId: dto.messageStructureId,
      language: dto.language,
    }, { transaction });

    // TODO: optimize
    try {
      if (templateToTranslate.objective) {
        const [translation] = await this.translateText(templateToTranslate.objective, dto.language);
        newTemplate.objective = translation;
      }
  
      if (templateToTranslate.subject) {
        const [translation] = await this.translateText(templateToTranslate.subject, dto.language);
        newTemplate.subject = translation;
      }
  
      if (templateToTranslate.greeting) {
        const [translation] = await this.translateText(templateToTranslate.greeting, dto.language);
        newTemplate.greeting = translation;
      }
  
      if (templateToTranslate.introduction) {
        const [translation] = await this.translateText(templateToTranslate.introduction.text, dto.language);
        newTemplate.introduction = { text: translation, wordsLimit: templateToTranslate.introduction.wordsLimit };
      }
  
      if (templateToTranslate.paragraphs) {
        const [translations] = await this.translateText(templateToTranslate.paragraphs.map(p => p.text), dto.language);
        newTemplate.paragraphs = templateToTranslate.paragraphs.map((p, index) => ({
          text: translations[index],
          wordsLimit: p.wordsLimit,
        }));
      }
  
      if (templateToTranslate?.goodbye) {
        const [translation] = await this.translateText(templateToTranslate.goodbye.text, dto.language);
        newTemplate.goodbye = { text: translation, wordsLimit: templateToTranslate.goodbye.wordsLimit };
      }
  
      if (templateToTranslate?.sampleMessage) {
        const [translation] = await this.translateText(templateToTranslate.sampleMessage, dto.language);
        newTemplate.sampleMessage = translation;
      }
    } catch (error) {
      await transaction.rollback();
      this.logger.error(error);
      throw new BadRequestException(`Unable to translate template ID: ${templateToTranslate.id}`);
    }
    
    await newTemplate.save({ transaction })
    await transaction.commit();

    return newTemplate;
  }

  async findOne(query: FindMessageTemplateDto): Promise<MessageTemplate | null> {
    const messageTemplate = await this.messageTemplateModel.findOne({
      where: {
        messageStructureId: query.structureId,
        language: query.language,
      },
    });

    if (!messageTemplate) {
      throw new NotFoundException('Message template not found');
    }

    return messageTemplate;
  }

  async findById(id: string): Promise<MessageTemplate | null> {
    const messageTemplate = await this.messageTemplateModel.findOne({
      where: {
        id,
      },
    });

    if (!messageTemplate) {
      throw new NotFoundException('Message template not found');
    }

    return messageTemplate;
  }

  async update(
    templateId: string,
    dto: UpdateMessageTemplateReq,
  ): Promise<MessageTemplate | null> {
    await this.findById(templateId);

    const messageTemplate = await this.messageTemplateModel.update(dto, {
      where: {
        id: templateId,
      },
      returning: true,
    });

    return messageTemplate[1][0];
  }

  async remove(templateId: string): Promise<void> {
    const messageTemplate = await this.messageTemplateModel.findOne({
      where: {
        id: templateId,
      }
    });

    const isMessageStructureUsed = await this.messageStructureService.isMessageStructureUsed(
      messageTemplate.messageStructureId,
    );

    if (isMessageStructureUsed) {
      throw new BadRequestException(
        'Message template cannot be removed because structure is used in the ongoing message scenario',
      );
    }
    
    await this.messageTemplateModel.destroy({
      where: {
        id: templateId,
      },
    });
  }
}
