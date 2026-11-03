import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import sgMail from '@sendgrid/mail';
import { sendGridConfig } from './config/send-grid.config';

@Injectable()
export class CommEmailService {
  private readonly logger = new Logger(CommEmailService.name);

  constructor(
    @Inject(sendGridConfig.KEY)
    private readonly sgConfig: ConfigType<typeof sendGridConfig>
  ) {
    sgMail.setApiKey(this.sgConfig.apiKey);
  }

  async sendEmailToken(to: string, token: string): Promise<boolean> {
    try {
      const msg = {
        from: this.sgConfig.fromEmail,
        to,
        subject: 'Authentication Link',
        html: `<a href="${this.sgConfig.resetPasswordLink}?token=${token}">Click here to reset your password</a>`,
      };

      await sgMail.send(msg);
      return true;
    } catch (e) {
      this.logger.error('Error sending email:', e);
      return false;
    }
  }

  async sendInvitation(to: string, invitationId: string): Promise<boolean> {
    try {
      const link = `${this.sgConfig.inviteLink}?invitationId=${invitationId}`;
      const msg = {
        from: this.sgConfig.fromEmail,
        to,
        subject: 'Invitation link',
        html: `
          <div>You’ve been invited to <a href="https://willbe.ai/">Willbe.ai</a>. Please, follow this link to finish the profile setup: <a href="${link}">${link}</a></div>
        `,
      };

      await sgMail.send(msg);
      return true;
    } catch (e) {
      this.logger.error('Error sending email:', e);
      return false;
    }
  }
}
