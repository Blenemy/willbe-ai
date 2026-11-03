import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLlmClient, LlmClient } from './llm/llm-client';

const FALLBACK_DESCRIPTION_LENGTH = 600;

@Injectable()
export class OpenaiService {
  private readonly logger = new Logger(OpenaiService.name);
  private readonly client: LlmClient | null;

  constructor(private readonly configService: ConfigService) {
    this.client = createLlmClient(this.configService, this.logger);
  }

  async trimDescription(description: string): Promise<string> {
    const fallback = (description ?? '').slice(0, FALLBACK_DESCRIPTION_LENGTH);

    if (!this.client || !description) {
      return fallback;
    }

    try {
      const summary = await this.client.complete(description, {
        system: 'Summarize the info provided in 500 words',
        maxTokens: 2048,
      });
      return summary.trim() || fallback;
    } catch (error) {
      this.logger.error(`LLM call failed (${this.client.description}), truncating description: ${(error as Error).message}`);
      return fallback;
    }
  }
}
