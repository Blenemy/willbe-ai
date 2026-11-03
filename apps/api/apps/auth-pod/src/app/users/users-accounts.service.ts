import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import {
  EmailServiceTokens,
  EmailServiceType,
  SentEmailMessage,
  SentMessageStatus,
  UserLinkedinAccount,
  OutlookSubscription,
  ReceivedMessage,
  HubspotToken,
  MessageEntryLeadData,
} from '@willbe-server/db-core';
import { googleConfig, microsoftConfig, unipileConfig } from '@willbe-server/shared-auth';
import { catchError, firstValueFrom } from 'rxjs';
import { google } from 'googleapis';
import { UsersService } from './users.service';
import { AxiosError } from 'axios';
import { ClaudeService } from '../message-scenarios/claude.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LinkedinProvider } from '../linkedin/linkedin.provider';
import { randomUUID } from 'node:crypto';

export interface IConnectGoogleAccount {
  accessToken: string,
  refreshToken: string,
}

export interface IConnectLinkedinAccount {
  accountId: string,
  userId: string,
}

export interface IConnectedAccounts {
  accessToken: string,
  refreshToken: string,
}

export interface ISendEmailData {
  toEmail: string;
  message: string;
  subject: string;
  userId: string;
}

export interface ISendLinkedinMessage {
  message: string;
  toId: string;
  userId: string;
}

export class ConnectedAccountsRes {
  linkedin: boolean;
  email: EmailServiceType | null;
  hubspot?: boolean;
  salesNavigator?: boolean;
}

@Injectable()
export class UsersAccountsService {
  private readonly logger = new Logger(UsersAccountsService.name);

  constructor(
    @InjectModel(EmailServiceTokens)
    private emailServiceTokensModel: typeof EmailServiceTokens,
    @InjectModel(UserLinkedinAccount)
    private userLinkedinAccountModel: typeof UserLinkedinAccount,
    @InjectModel(SentEmailMessage)
    private readonly sentEmailMessageModel: typeof SentEmailMessage,
    @InjectModel(OutlookSubscription)
    private readonly outlookSubscriptionModel: typeof OutlookSubscription,
    @InjectModel(ReceivedMessage)
    private readonly receivedMessageModel: typeof ReceivedMessage,
    @InjectModel(HubspotToken)
    private readonly hubspotTokenModel: typeof HubspotToken,
    @Inject(googleConfig.KEY)
    private readonly googleCfg: ConfigType<typeof googleConfig>,
    @Inject(microsoftConfig.KEY)
    private readonly microsoftCfg: ConfigType<typeof microsoftConfig>,
    @Inject(unipileConfig.KEY)
    private readonly unipileCfg: ConfigType<typeof unipileConfig>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly claudeService: ClaudeService,
    private readonly linkedinProvider: LinkedinProvider,
  ) {}

  async findConnectedAccounts(userId: string): Promise<ConnectedAccountsRes> {
    const user = await this.usersService.findById(userId);

    const [
      emailServiceTokensRecord,
      linkedinUserAccountRecord,
      hubspotTokenRecord,
    ] = await Promise.all([
      this.emailServiceTokensModel.findOne({
        where: { userId },
      }),
      this.userLinkedinAccountModel.findOne({
        where: { userId },
      }),
      this.hubspotTokenModel.findOne({
        where: { companyId: user.companyId },
      }),
    ]);

    const accountsStatus: ConnectedAccountsRes = {
      email: null,
      linkedin: false,
      hubspot: false,
      salesNavigator: false,
    };
    
    if (emailServiceTokensRecord) {
      accountsStatus.email = emailServiceTokensRecord.type;
    } else if (this.configService.get('EMAIL_DELIVERY') === 'mock') {
      accountsStatus.email = EmailServiceType.GMAIL;
    }

    if (linkedinUserAccountRecord) {
      accountsStatus.linkedin = true;
      accountsStatus.salesNavigator = linkedinUserAccountRecord.salesNavigator;
    }

    if (hubspotTokenRecord) {
      accountsStatus.hubspot = true;
    }

    return accountsStatus; 
  }

  async connectGmailAccount(
    userId: string,
    data: IConnectGoogleAccount,
  ) {
    try {
      // TODO: add tokens encryption
      const emailServiceTokensRecord = await this.emailServiceTokensModel.create({
        userId,
        type: EmailServiceType.GMAIL,
        ...data,
      });

      const gmail = google.gmail({ version: 'v1', auth: data.accessToken });

      const auth = new google.auth.OAuth2(
        this.googleCfg.clientId,
        this.googleCfg.clientSecret,
        this.googleCfg.callbackUrl,
      );

      auth.setCredentials({
        access_token: emailServiceTokensRecord.accessToken,
        refresh_token: emailServiceTokensRecord.refreshToken,
      });
  
      return emailServiceTokensRecord;
    } catch (error) {
      this.logger.error(`Error connecting Gmail account for user: ${userId}`);
      this.logger.error(error);
      throw new BadRequestException('Failed to connect to Gmail account');
    }
  }

  async connectOutlookAccount(
    userId: string,
    authCode: string,
  ) {
    try {
      // TODO: add tokens encryption
      const endpoint = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

      const res = await firstValueFrom(
        this.httpService.post(
          endpoint,
          new URLSearchParams({
            client_id: this.microsoftCfg.clientId,
            client_secret: this.microsoftCfg.clientSecret,
            code: authCode,
            redirect_uri: this.microsoftCfg.callbackUrl,
            grant_type: 'authorization_code',
            scope: 'Mail.Read Mail.ReadWrite Mail.Send offline_access User.Read',
          }).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ).pipe(
          catchError((error: AxiosError) => {
            console.log('1 error');
            console.log(error);
            this.logger.error(error.message);
            throw new BadRequestException('Failed to connect to Outlook account');
          }),
        ),
      );

      const { access_token, refresh_token } = res.data;

      const emailServiceTokensRecord = await this.emailServiceTokensModel.create({
        userId,
        type: EmailServiceType.OUTLOOK,
        accessToken: access_token,
        refreshToken: refresh_token,
      });

      return emailServiceTokensRecord;
    } catch (error) {
      this.logger.error(`Error connecting Outlook account for user: ${userId}`);
      this.logger.error(error);
      throw new BadRequestException('Failed to connect to Outlook account');
    }
  }

  async connectLinkedinAccount(data: IConnectLinkedinAccount) {
    try {
      
      const isSalesNavigatorConnected = await this.linkedinProvider.hasSalesNavigator(data.accountId);

      const userLinkedinAccount = await this.userLinkedinAccountModel.create({
        ...data,
        salesNavigator: isSalesNavigatorConnected,
      });

      return userLinkedinAccount;
    } catch (error) {
      this.logger.error(`Error connecting Linkedin account for user: ${data.userId}`);
      this.logger.error(error);
      throw new BadRequestException('Failed to connect to Linkedin account');
    }
  } 

  async findLinkedinAccountId(userId: string) {
    const userLinkedinAccount = await this.userLinkedinAccountModel.findOne({
      where: { userId },
    });

    if (!userLinkedinAccount) {
      this.logger.error(`No Linkedin account ID for user ${userId}`);
      throw new BadRequestException('LinkedIn account not connected');
    }

    return userLinkedinAccount.accountId;
  }

  async removeUserEmailAccount(userId: string) {
    const emailServiceTokensRecord = await this.emailServiceTokensModel.findOne({
      where: { userId },
    });

    if (!emailServiceTokensRecord) {
      return;
    }

    if (emailServiceTokensRecord.type === EmailServiceType.GMAIL) {
      const gmail = google.gmail({ version: 'v1', auth: emailServiceTokensRecord.accessToken });

      const auth = new google.auth.OAuth2(
        this.googleCfg.clientId,
        this.googleCfg.clientSecret,
        this.googleCfg.callbackUrl,
      );
  
      auth.setCredentials({
        access_token: emailServiceTokensRecord.accessToken,
        refresh_token: emailServiceTokensRecord.refreshToken,
      });
  
      await gmail.users.stop({
        userId: 'me',
        auth,
      })
    }

    if (emailServiceTokensRecord.type === EmailServiceType.OUTLOOK) {
      await this.outlookSubscriptionModel.destroy({
        where: { userId },
      });
    }

    await this.emailServiceTokensModel.destroy({
      where: { userId },
    });

    return;
  }

  async removeUserLinkedinAccount(userId: string) {
    try {
      const linkedinUserAccountRecord = await this.userLinkedinAccountModel.findOne({
        where: { userId },
      });

      if (!linkedinUserAccountRecord) {
        return;
      }

      await Promise.all([
        this.linkedinProvider.deleteAccount(linkedinUserAccountRecord.accountId),
        linkedinUserAccountRecord.destroy(),
      ]);

      return;
    } catch (error) {
      this.logger.error(`Error removing Linkedin account for user: ${userId}`);
      this.logger.error(error);
      throw new BadRequestException('Failed to remove Linkedin account');
    }
  }

  generateGoogleAuthUrl(userId: string): string {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount';

    url += '?response_type=code';
    url += `&redirect_uri=${encodeURIComponent(this.googleCfg.callbackUrl)}`;
    url += '&scope=email%20profile%20openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.settings.basic%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.labels%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.send%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.modify';
    url += `&client_id=${this.googleCfg.clientId}`;
    url += '&service=lso';
    url += '&o2v=2';
    url += '&ddm=1';
    url += '&flowName=GeneralOAuthFlow';
    url += '&access_type=offline';
    url += '&prompt=consent';
    url += `&state=${userId}`;

    return url;
  }

  generateMicrosoftUrl(userId: string): string {
    let url = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';

    url += `?client_id=${this.microsoftCfg.clientId}`;
    url += '&response_type=code';
    url += `&redirect_uri=${this.microsoftCfg.callbackUrl}`;
    url += '&scope=Mail.Read%20Mail.ReadWrite%20Mail.Send%20offline_access%20User.Read';
    url += '&response_mode=query';
    url += '&access_type=offline';
    url += '&prompt=consent';
    url += `&state=${userId}`;

    return url;
  }

  async generateLinkedinUrl(userId: string): Promise<string> {
    return this.linkedinProvider.createHostedAuthLink(userId);
  }

  /**
   * Mock-provider replacement for the Unipile hosted auth page + notify webhook.
   * Returns the URL the browser should be redirected to afterwards.
   */
  async connectMockLinkedinAccount(userId: string): Promise<string> {
    if (!this.linkedinProvider.isMock) {
      throw new NotFoundException();
    }

    await this.usersService.findById(userId);
    const existing = await this.userLinkedinAccountModel.findOne({ where: { userId } });
    if (!existing) {
      await this.connectLinkedinAccount({ accountId: `mock-${userId}`, userId });
    }

    return this.unipileCfg.linkedinAuthRedirectUrl;
  }

  async sendEmail(
    data: ISendEmailData,
  ) {
  const emailServiceTokens = await this.emailServiceTokensModel.findOne({
    where: { userId: data.userId },
  });

  if (!emailServiceTokens) {
    if (this.configService.get('EMAIL_DELIVERY') !== 'mock') {
      throw new BadRequestException('No email account connected');
    }
    this.logger.log(`[mock] Email to ${data.toEmail}: ${data.subject}`);
    return { threadId: `mock-${randomUUID()}` };
  }

  if (emailServiceTokens.type === EmailServiceType.GMAIL) {
    return await this.sendGmailEmail(data, emailServiceTokens);
  }

  if (emailServiceTokens.type === EmailServiceType.OUTLOOK) {
    return await this.sendOutlookEmail(data, emailServiceTokens);
  }

    return;
  }

  async sendGmailEmail(
    data: ISendEmailData,
    emailServiceTokens: EmailServiceTokens,
  ): Promise<any> {
    for (let i = 0; i <= 1; i++) {
      try {
        const message = `To: ${data.toEmail}
Subject: ${data.subject}
MIME-Version: 1.0
Content-Type: text/html; charset=UTF-8

${data.message}
        `;
  
      const encodedMessage = Buffer.from(message).toString('base64');
  
      const res = await firstValueFrom(
        this.httpService.post(
          'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
          { raw: encodedMessage },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${emailServiceTokens.accessToken}`,
            },
          },
        ),
      );

      const gmail = google.gmail({ version: 'v1', auth: emailServiceTokens.accessToken });
  
      return res.data;
      } catch (err) {
        if (err.status === 401) {
          await this.updateGmailAccessToken(emailServiceTokens);
        }
      }
    }

    throw new InternalServerErrorException('Failed to send Outlook email');
  }

  async sendOutlookEmail(
    data: ISendEmailData,
    emailServiceTokens: EmailServiceTokens,
  ): Promise<void> {
    
   for (let i = 0; i <= 1; i++) {
    try {
      const res = await firstValueFrom(
        this.httpService.post(
          'https://graph.microsoft.com/v1.0/me/sendMail',
          {
            message: {
              subject: data.subject,
              body: {
                contentType: 'Html',
                content: data.message
              },
              toRecipients: [
                {
                  emailAddress: {
                    address: data.toEmail,
                  }
                }
              ]
            }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${emailServiceTokens.accessToken}`,
            },
          },
        ),
      );

      const messageRes = await firstValueFrom(
        this.httpService.get(
          `https://graph.microsoft.com/v1.0/me/mailFolders('sentitems')/messages?$top=1&$orderby=sentDateTime desc`,
          {
            headers: {
              'Authorization': `Bearer ${emailServiceTokens.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const message = messageRes.data.value[0];

      return message;
    } catch (err) {
      if (err.status === 401) {
        await this.updateOutlookAccessToken(emailServiceTokens);
      }
    }
   }
    
    throw new InternalServerErrorException('Failed to send Outlook email');
  }

  async updateGmailAccessToken(emailServiceTokens: EmailServiceTokens): Promise<void> {
    const res = await firstValueFrom(
      this.httpService.post(
        'https://oauth2.googleapis.com/token',
        {
          grant_type: "refresh_token",
          client_id: this.googleCfg.clientId,
          client_secret: this.googleCfg.clientSecret,
          refresh_token: emailServiceTokens.refreshToken,
        },
      ),
    );

    emailServiceTokens.accessToken = res.data.access_token;
    emailServiceTokens.refreshToken = res.data.refresh_token;

    await emailServiceTokens.save();

    return;
  }

  async updateOutlookAccessToken(emailServiceTokens: EmailServiceTokens): Promise<void> {
    const data = new URLSearchParams();
    data.append('grant_type', 'refresh_token');
    data.append('refresh_token', emailServiceTokens.refreshToken);
    data.append('client_id', this.microsoftCfg.clientId);
    data.append('client_secret', this.microsoftCfg.clientSecret);

    const res = await firstValueFrom(
      this.httpService.post(
        'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        data.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }, 
      ),
    );

    emailServiceTokens.accessToken = res.data.access_token;
    emailServiceTokens.refreshToken = res.data.refresh_token;

    await emailServiceTokens.save();

    return;
  }

  async sendLinkedinConnection(data: ISendLinkedinMessage): Promise<void> {
    const linkedinAccountId = await this.userLinkedinAccountModel.findOne({
      where: {
        userId: data.userId,
      },
    });
    
    if (!linkedinAccountId) {
      this.logger.error(`No Linkedin account ID for user ${data.userId} while sending Linkedin connection`);
      return;
    }

    await this.linkedinProvider.sendInvitation(linkedinAccountId.accountId, data.toId, data?.message ?? null);
    return;
  }

  async sendLinkedinMessage(data: ISendLinkedinMessage): Promise<void> {
    const linkedinAccountId = await this.userLinkedinAccountModel.findOne({
      where: {
        userId: data.userId,
      },
    });
    
    if (!linkedinAccountId) {
      this.logger.error(`No Linkedin account ID for user ${data.userId} while sending Linkedin message`);
      return;
    }

    await this.linkedinProvider.sendMessage(linkedinAccountId.accountId, data.toId, data.message);
  }

   async gmailNotify(historyId: string, emailAddress: string) {
    const user = await this.usersService.findByEmail(emailAddress);

    if (!user) {
      this.logger.warn(`Gmail notify, no Gmail connected account was found for email: ${emailAddress}`);
    }

    const emailServiceTokens = await this.emailServiceTokensModel.findOne({
      where: { userId: user.id },
    });

    if (!emailServiceTokens || emailServiceTokens.type !== EmailServiceType.GMAIL) {
      return;
    }

    for (let i = 0; i <= 1; i++) {
      const auth = new google.auth.OAuth2(
        this.googleCfg.clientId,
        this.googleCfg.clientSecret,
        this.googleCfg.callbackUrl,
      );

    auth.setCredentials({
      access_token: emailServiceTokens.accessToken,
      refresh_token: emailServiceTokens.refreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth });

    for (let i = 0; i <= 1; i++) {
      try {
        const response = await gmail.users.history.list({
          userId: 'me',
          startHistoryId: historyId,
          historyTypes: ['messageAdded'],
          auth,
        });
        const messages = response.data.history?.flatMap(h => h.messages) || [];
        
        for (const msg of messages) {
          const fullMessage = await gmail.users.messages.get({
            userId: 'me',
            id: msg.id!,
            format: 'metadata',
            auth,
          });
        }
      } catch (err) {
        if (err.status === 401) {
          await this.updateGmailAccessToken(emailServiceTokens);
        }
      }
    }
    return;
    }
  }

  async outlookNotify(data: any) {
    const subscription = await this.outlookSubscriptionModel.findOne({
      where: {
        subscriptionId: data.subscriptionId,
      },
    });

    if (!subscription) {
      return;
    }

    const emailServiceTokens = await this.emailServiceTokensModel.findOne({
      where: { userId: subscription.userId },
    });

    if (!emailServiceTokens || emailServiceTokens.type !== EmailServiceType.OUTLOOK) {
      return;
    }

    for (let i = 0; i <= 1; i++) {
      try {
        const messageId = data.resourceData.id;

        const { data: messageData } = await firstValueFrom(
          this.httpService.get(
            `https://graph.microsoft.com/v1.0/me/messages/${messageId}?$select=internetMessageId,internetMessageHeaders,body`,
            {
              headers: {
                Authorization: `Bearer ${emailServiceTokens.accessToken}`,
                'Content-Type': 'application/json',
              },
            },
          ),
        );
    
        const replyHeader = messageData.internetMessageHeaders.find(h => h.name === 'In-Reply-To');
    
        if (!replyHeader) {
          return;
        }
    
        const replyId = replyHeader.value;
    
        const originalMessage = await this.sentEmailMessageModel.findOne({
          where: {
            emailMessageId: replyId,
          },
        });
    
        if (!originalMessage) {
          return;
        }

        const isOutOfOfficeEmail = await this.claudeService.isOutOfOfficeEmail(messageData.body.content);

        await this.sentEmailMessageModel.update({
          status: isOutOfOfficeEmail ? SentMessageStatus.OUT_OF_OFFICE : SentMessageStatus.RESPONDED,
        }, {
          where: {
            id: originalMessage.id,
          },
        });
    
        await this.receivedMessageModel.create({
          message: messageData.body.content,
          sentEmailMessageId: originalMessage.id,
        });
      } catch (err) {
        if (err.status === 401) {
          await this.updateOutlookAccessToken(emailServiceTokens);
        }
      }
    }

    return;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleGetResponses() {
    this.logger.log('Getting email responses')
    const emailServiceTokens = await this.emailServiceTokensModel.findAll();

    for (const emailServiceToken of emailServiceTokens) {
      if (emailServiceToken.type === EmailServiceType.GMAIL) {
        await this.handleGetResponsesForGmailUser(emailServiceToken);
      }
      if (emailServiceToken.type === EmailServiceType.OUTLOOK) {
        await this.handleGetResponsesForOutlookUser(emailServiceToken);
      }
    }
  }

  async handleGetResponsesForGmailUser(emailServiceTokens: EmailServiceTokens) {
      for (let i = 0; i <= 1; i++) {
        try {
          const auth = new google.auth.OAuth2(
            this.googleCfg.clientId,
            this.googleCfg.clientSecret,
            this.googleCfg.callbackUrl,
          );
      
          auth.setCredentials({
            access_token: emailServiceTokens.accessToken,
            refresh_token: emailServiceTokens.refreshToken,
          });
      
          const gmail = google.gmail({ version: 'v1', auth: emailServiceTokens.accessToken });

          const now = Math.floor(Date.now() / 1000);
          const fiveMinutesAgo = now - 5 * 60;
          const q = `after:${fiveMinutesAgo} in:inbox`;
      
          const list = await gmail.users.messages.list({
            userId: 'me',
            q,
            auth,
          });

          function getBody(payload: any): string | null {
            if (!payload) return null;
          
            if (payload.body?.data) {
              return Buffer.from(payload.body.data, 'base64').toString('utf-8');
            }
          
            if (payload.parts) {
              for (const part of payload.parts) {
                if (part.mimeType === 'text/plain' && part.body?.data) {
                  return Buffer.from(part.body.data, 'base64').toString('utf-8');
                }
              }
          
              for (const part of payload.parts) {
                if (part.mimeType === 'text/html' && part.body?.data) {
                  return Buffer.from(part.body.data, 'base64').toString('utf-8');
                }
              }
            }
          
            return null;
          }
      
          for (const msg of list.data.messages || []) {
            const full = await gmail.users.messages.get({
              userId: 'me',
              id: msg.id!,
              format: 'full',
              auth,
            });
          
            const headers = full.data.payload?.headers || [];
            const inReplyTo = headers.find(h => h.name === 'In-Reply-To')?.value;

            const sentMessage = await this.sentEmailMessageModel.findOne({
              where: {
                emailMessageId: full.data.threadId,
              }
            });

            if (!sentMessage) {
              continue;
            }

            const bodyText = getBody(full.data.payload);
            const isOutOfOfficeEmail = await this.claudeService.isOutOfOfficeEmail(bodyText);

            await this.sentEmailMessageModel.update({
              status: isOutOfOfficeEmail ? SentMessageStatus.OUT_OF_OFFICE : SentMessageStatus.RESPONDED,
            }, {
              where: {
                id: sentMessage.id,
              },
            });

            await this.receivedMessageModel.create({
              message: bodyText,
              sentEmailMessageId: sentMessage.id,
            }); 
          }

          return;
          } catch (err) {
          if (err.status === 401) {
            await this.updateGmailAccessToken(emailServiceTokens);
          }
        }
      }
  }

  async handleGetResponsesForOutlookUser(emailServiceTokens: EmailServiceTokens) {
    for (let i = 0; i <= 1; i++) {
      try {
        const accessToken = `Bearer ${emailServiceTokens.accessToken}`;
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        const filter = `receivedDateTime ge ${fiveMinutesAgo.toISOString()}`;

        const res = await firstValueFrom(
          this.httpService.get(
            `https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$filter=${encodeURIComponent(filter)}&$orderby=receivedDateTime desc`,
            {
              headers: {
                Authorization: accessToken,
                'Prefer': 'outlook.body-content-type="text"',
              },
            }
          ),
        );

        for (const message of res.data.value) {
          const bodyText = message.body?.content;
          const sentMessage = await this.sentEmailMessageModel.findOne({
            where: {
              emailMessageId: message.conversationId,
            }
          });

          if (!sentMessage) {
            continue;
          }

          const isOutOfOfficeEmail = await this.claudeService.isOutOfOfficeEmail(bodyText);
          await this.sentEmailMessageModel.update({
            status: isOutOfOfficeEmail ? SentMessageStatus.OUT_OF_OFFICE : SentMessageStatus.RESPONDED,
          }, {
            where: {
              id: sentMessage.id,
            },
          });

          await this.receivedMessageModel.create({
            message: bodyText,
            sentEmailMessageId: sentMessage.id,
          });
        }

        return;
        } catch (err) {
        if (err.status === 401) {
          await this.updateOutlookAccessToken(emailServiceTokens);
        }
      }
    }
  }
} 
