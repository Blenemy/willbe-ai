import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { ChatOpenAI } from '@langchain/openai';

export type LlmProvider = 'none' | 'openai-compatible' | 'claude';

export interface LlmCompleteOptions {
  system?: string;
  maxTokens?: number;
}

export interface LlmClient {
  readonly description: string;
  complete(prompt: string, options?: LlmCompleteOptions): Promise<string>;
}

const DEFAULT_MAX_TOKENS = 1024;

class ClaudeLlmClient implements LlmClient {
  private readonly client: Anthropic;

  constructor(apiKey: string, private readonly model: string) {
    this.client = new Anthropic({ apiKey });
  }

  get description(): string {
    return `claude (${this.model})`;
  }

  async complete(prompt: string, options: LlmCompleteOptions = {}): Promise<string> {
    const message = await this.client.messages.create({
      max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
      system: options.system,
      messages: [{ role: 'user', content: prompt }],
      model: this.model,
    });

    const first = message.content?.[0];
    return first && first.type === 'text' ? first.text : '';
  }
}

class OpenAiCompatibleLlmClient implements LlmClient {
  constructor(private readonly baseURL: string | undefined, private readonly apiKey: string, private readonly model: string) {}

  get description(): string {
    return `openai-compatible (${this.model} @ ${this.baseURL ?? 'api.openai.com'})`;
  }

  async complete(prompt: string, options: LlmCompleteOptions = {}): Promise<string> {
    const chat = new ChatOpenAI({
      apiKey: this.apiKey,
      model: this.model,
      temperature: 1,
      maxTokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
      configuration: { baseURL: this.baseURL },
    });

    const messages = [
      ...(options.system ? [{ role: 'system', content: options.system }] : []),
      { role: 'user', content: prompt },
    ];
    const response = await chat.invoke(messages);

    if (typeof response.content === 'string') {
      return response.content;
    }

    return response.content
      .map((part) => (part.type === 'text' && 'text' in part ? String(part.text) : ''))
      .join('');
  }
}

export function createLlmClient(configService: ConfigService, logger: Logger): LlmClient | null {
  const provider = (configService.get<string>('LLM_PROVIDER') || 'none').trim().toLowerCase() as LlmProvider;

  if (provider === 'none') {
    return null;
  }

  if (provider === 'claude') {
    const apiKey = configService.get<string>('CLAUDE_API_KEY');
    if (!apiKey) {
      logger.warn('LLM_PROVIDER=claude but CLAUDE_API_KEY is not set, falling back to templates');
      return null;
    }
    return new ClaudeLlmClient(apiKey, configService.get<string>('CLAUDE_MODEL') || 'claude-sonnet-4-5');
  }

  if (provider === 'openai-compatible') {
    const model = configService.get<string>('LLM_MODEL');
    if (!model) {
      logger.warn('LLM_PROVIDER=openai-compatible but LLM_MODEL is not set, falling back to templates');
      return null;
    }
    const baseURL = configService.get<string>('LLM_BASE_URL') || undefined;
    // Local servers like Ollama ignore the key, but the OpenAI client refuses to start without one.
    const apiKey = configService.get<string>('LLM_API_KEY') || 'not-needed';
    return new OpenAiCompatibleLlmClient(baseURL, apiKey, model);
  }

  logger.warn(`Unknown LLM_PROVIDER "${provider}", falling back to templates`);
  return null;
}
