import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ClaudeService } from '../claude.service';
import { UsersAccountsService } from '../../users/users-accounts.service';

@Processor('messages-generation')
export class MessagesGenerationProcessor extends WorkerHost {
  constructor(
    private readonly claudeService: ClaudeService,
    private readonly usersAccountsService: UsersAccountsService,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<string> {
    if (job.name === 'generateMessage') {
      const linkedinAccountId = await this.usersAccountsService.findLinkedinAccountId(job.data.userId);

      const message = await this.claudeService.generateMessage(
        job.data.messageEntryLeadData,
        job.data.type,
        linkedinAccountId,
      );

      return message;
    }
  }
}
