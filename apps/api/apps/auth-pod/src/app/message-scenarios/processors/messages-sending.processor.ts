import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { UsersAccountsService } from '../../users/users-accounts.service';
import { InjectModel } from '@nestjs/sequelize';
import { SentEmailMessage, SentMessageStatus } from '@willbe-server/db-core';

@Processor('messages-sending')
export class MessagesSendingProcessor extends WorkerHost {
  constructor(
    private readonly usersAccountsService: UsersAccountsService,
    @InjectModel(SentEmailMessage)
    private readonly sentEmailMessageModel: typeof SentEmailMessage,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<void> {
    if (job.name === 'sendMessage') {
      const data = await this.usersAccountsService.sendEmail(job.data);

      console.log('DATA_SEND:');
      console.log(data);

      if ('internetMessageId' in data) {
        await this.sentEmailMessageModel.create({
          messageEntryLeadDataId: job.data.messageEntryLeadDataId,
          emailMessageId: data.conversationId,
          messageScenarioId: job.data.messageScenarioId,
          status: SentMessageStatus.SENT,
          sentAt: new Date(),
        });
        return;
      }

      await this.sentEmailMessageModel.create({
        messageEntryLeadDataId: job.data.messageEntryLeadDataId,
        emailMessageId: data.threadId,
        messageScenarioId: job.data.messageScenarioId,
        status: SentMessageStatus.SENT,
        sentAt: new Date(),
      });
    }

    if (job.name === 'sendLinkedinConnection') {
      this.usersAccountsService.sendLinkedinConnection(job.data);
    }

    if (job.name === 'sendLinkedinMessage') {
      this.usersAccountsService.sendLinkedinMessage(job.data);
    }
  }
}
