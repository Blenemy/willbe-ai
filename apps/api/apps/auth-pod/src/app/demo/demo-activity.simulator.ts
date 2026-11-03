import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import {
  LeadCampaignStatus,
  MessageEntryLeadData,
  ReceivedMessage,
  SentEmailMessage,
  SentMessageStatus,
} from '@willbe-server/db-core';
import { createHash } from 'node:crypto';
import { Op } from 'sequelize';

const BATCH_SIZE = 200;

const REPLIES = [
  'Thanks for reaching out! This is timely, we are reviewing our outbound tooling this quarter. Could we talk next week?',
  'Interesting, can you share a short deck or a case study from a similar company?',
  'Happy to chat. Tuesday afternoon works for me, feel free to send an invite.',
  'Not a priority right now, but please follow up in a couple of months.',
];

const OUT_OF_OFFICE_REPLY = 'I am currently out of the office with limited access to email and will reply when I am back.';

/**
 * Gives mock-delivered emails a plausible outcome (reply, meeting, out of office, bounce) after a short delay,
 * so statistics and the home dashboard have data without real mailboxes.
 */
@Injectable()
export class DemoActivitySimulator {
  private readonly logger = new Logger(DemoActivitySimulator.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(SentEmailMessage)
    private readonly sentEmailMessageModel: typeof SentEmailMessage,
    @InjectModel(ReceivedMessage)
    private readonly receivedMessageModel: typeof ReceivedMessage,
    @InjectModel(MessageEntryLeadData)
    private readonly messageEntryLeadDataModel: typeof MessageEntryLeadData,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async simulateOutcomes(): Promise<void> {
    if (this.configService.get('EMAIL_DELIVERY') !== 'mock') {
      return;
    }

    const delayMinutes = Number(this.configService.get('DEMO_REPLY_DELAY_MINUTES') ?? 2);
    const pending = await this.sentEmailMessageModel.findAll({
      where: {
        status: SentMessageStatus.SENT,
        emailMessageId: { [Op.like]: 'mock-%' },
        sentAt: { [Op.lte]: new Date(Date.now() - delayMinutes * 60_000) },
      },
      limit: BATCH_SIZE,
    });

    for (const sent of pending) {
      await this.applyOutcome(sent);
    }

    if (pending.length) {
      this.logger.log(`Simulated outcomes for ${pending.length} mock emails`);
    }
  }

  private async applyOutcome(sent: SentEmailMessage): Promise<void> {
    const roll = this.roll(sent.id);
    const now = new Date();

    if (roll < 0.3) {
      sent.status = SentMessageStatus.RESPONDED;
      sent.respondedAt = now;
      await sent.save();
      await this.receivedMessageModel.create({
        sentEmailMessageId: sent.id,
        message: REPLIES[Math.floor(this.roll(`${sent.id}:reply`) * REPLIES.length)],
      });
      const status = this.roll(`${sent.id}:meeting`) < 0.4 ? LeadCampaignStatus.MEETING : LeadCampaignStatus.RESPONSE;
      await this.updateLeadStatus(sent.messageEntryLeadDataId, status);
      return;
    }

    if (roll < 0.38) {
      sent.status = SentMessageStatus.OUT_OF_OFFICE;
      sent.respondedAt = now;
      await sent.save();
      await this.receivedMessageModel.create({ sentEmailMessageId: sent.id, message: OUT_OF_OFFICE_REPLY });
      return;
    }

    if (roll < 0.45) {
      sent.status = SentMessageStatus.BOUNCED;
      await sent.save();
      await this.updateLeadStatus(sent.messageEntryLeadDataId, LeadCampaignStatus.BOUNCED);
      return;
    }

    sent.status = SentMessageStatus.NOT_ANSWERED;
    await sent.save();
  }

  private async updateLeadStatus(messageEntryLeadDataId: string, status: LeadCampaignStatus): Promise<void> {
    await this.messageEntryLeadDataModel.update({ status }, { where: { id: messageEntryLeadDataId } });
  }

  /** Stable pseudo-random number in [0, 1) derived from a key. */
  private roll(key: string): number {
    return createHash('sha256').update(key).digest().readUInt32BE(0) / 2 ** 32;
  }
}
