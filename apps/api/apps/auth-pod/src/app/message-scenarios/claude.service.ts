import { Injectable, Logger } from '@nestjs/common';
import { MessageEntryLeadData, MessageEntryType } from '@willbe-server/db-core';
import { ConfigService } from '@nestjs/config';
import { CompaniesService } from '../companies/companies.service';
import { LinkedinProvider } from '../linkedin/linkedin.provider';
import { buildTemplateMessage } from './prompts/template-fallback';

import { buildLinkedinConnectionPrompt } from './prompts/linkedin-connection';
import { buildLinkedinMessagePrompt } from './prompts/linkedin-message';
import { buildFirstEmailPrompt } from './prompts/first-email';
import { buildOutOfOfficeEnglishPrompt } from './prompts/out-of-office/out-of-office-english.prompt';
import { OpenaiService } from './openai.service';
import { CompaniesProductsService } from '../companies/companies-products.service';
import { buildFollowUpEmailPrompt } from './prompts/follow-up-email';
import { pickTemplate } from './pick-template';
import { buildFollowUpLinkedinPrompt } from './prompts/follow-up-linkedin';
import { createLlmClient, LlmClient } from './llm/llm-client';

const OUT_OF_OFFICE_PATTERN = /out of (the )?office|auto(matic)?[- ]?reply|on (vacation|holiday|leave)|absence|absent|fuera de la oficina|absent du bureau/i;

@Injectable()
export class ClaudeService {
  private readonly logger = new Logger(ClaudeService.name);
  private readonly client: LlmClient | null;

  constructor(
    private readonly configService: ConfigService,
    private readonly companiesService: CompaniesService,
    private readonly companiesProductsService: CompaniesProductsService,
    private readonly linkedinProvider: LinkedinProvider,
    private readonly openaiService: OpenaiService,
  ) {
    this.client = createLlmClient(this.configService, this.logger);

    if (this.client) {
      this.logger.log(`Messages will be generated with ${this.client.description}`);
    } else {
      this.logger.warn('LLM_PROVIDER is none, messages will be generated from templates');
    }
  }


  async generateMessage(
    messageEntryLeadData: MessageEntryLeadData,
    type: MessageEntryType,
    linkedinAccountId: string,
  ): Promise<string> {
    const messageTemplate = pickTemplate(messageEntryLeadData.messageStructure.templates, messageEntryLeadData.language);

    const company = await this.companiesService.findById(messageEntryLeadData.productService.companyId);
    const companyProduct = await this.companiesProductsService.findById(messageEntryLeadData.productService.id);

    const targetCompanyFullInfo = {
      data: await this.linkedinProvider.getCompany(
        linkedinAccountId,
        messageEntryLeadData.lead.leadData.current_positions[0].company_id,
      ),
    };

    let prompt = '';

    if (!company.shortDescription) {
      const shortDescription = await this.openaiService.trimDescription(company.description);
      company.shortDescription = shortDescription;
      await company.save();
    }

    if (!companyProduct.shortDescription) {
      const shortDescription = await this.openaiService.trimDescription(companyProduct.description);
      companyProduct.shortDescription = shortDescription;
      await companyProduct.save();
      messageEntryLeadData.productService.shortDescription = shortDescription;
    }

    const buildFromTemplate = () => {
      const lead = messageEntryLeadData.lead.leadData;
      return buildTemplateMessage(type, {
        leadFirstName: lead.first_name,
        leadRole: lead.current_positions[0]?.role,
        targetCompanyName: targetCompanyFullInfo.data.name,
        targetIndustry: targetCompanyFullInfo.data.industry[0],
        senderCompanyName: company.name,
        productName: companyProduct.name,
        productSummary: companyProduct.shortDescription ?? companyProduct.description ?? '',
      });
    };

    if (!this.client) {
      return buildFromTemplate();
    }

    if (type === MessageEntryType.FIRST_EMAIL) {
      prompt = buildFirstEmailPrompt(messageEntryLeadData.language, {
        messageTemplate,
        company,
        messageEntryLeadData,
        targetCompanyFullInfo,
      });
    }

    if (type === MessageEntryType.LINKEDIN_CONNECTION) {
      prompt = buildLinkedinConnectionPrompt(messageEntryLeadData.language, {
        messageTemplate,
        company,
        messageEntryLeadData,
        targetCompanyFullInfo,
      });
    }

    if (type === MessageEntryType.LINKEDIN_MESSAGE) {
      prompt = buildLinkedinMessagePrompt(messageEntryLeadData.language, {
        messageTemplate,
        company,
        messageEntryLeadData,
        targetCompanyFullInfo,
      });
    }

    if (type === MessageEntryType.FOLLOW_UP_EMAIL) {
      prompt = buildFollowUpEmailPrompt(messageEntryLeadData.language, {
        messageTemplate,
        company,
        messageEntryLeadData,
        targetCompanyFullInfo,
      });
    }

    if (type === MessageEntryType.LINKEDIN_FOLLOW_UP) {
      prompt = buildFollowUpLinkedinPrompt(messageEntryLeadData.language, {
        messageTemplate,
        company,
        messageEntryLeadData,
        targetCompanyFullInfo,
      });
    }


    let generatedMessage = '';

    try {
      generatedMessage = await this.client.complete(prompt);
    } catch (error) {
      this.logger.error(`LLM call failed (${this.client.description}), using template: ${(error as Error).message}`);
      return buildFromTemplate();
    }

    if (!generatedMessage.trim()) {
      return buildFromTemplate();
    }

    generatedMessage = generatedMessage
      .replace(/<b>\s+/g, '<b>')
      .replace(/\s+<\/b>/g, '</b>');

    if (type === MessageEntryType.FIRST_EMAIL || type === MessageEntryType.FOLLOW_UP_EMAIL) {
      generatedMessage = generatedMessage
        .replace(/\n\n/g, '<br>');
    }

    return generatedMessage;
  }

  async isOutOfOfficeEmail(emailBody: string): Promise<boolean> {
    if (!this.client) {
      return OUT_OF_OFFICE_PATTERN.test(emailBody ?? '');
    }

    const prompt = buildOutOfOfficeEnglishPrompt({
      emailBody
    });

    try {
      const answer = await this.client.complete(prompt);
      return answer.includes('YES');
    } catch (error) {
      this.logger.error(`LLM call failed (${this.client.description}), using regex: ${(error as Error).message}`);
      return OUT_OF_OFFICE_PATTERN.test(emailBody ?? '');
    }
  }
}
