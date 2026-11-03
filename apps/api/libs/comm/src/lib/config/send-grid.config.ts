/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { registerAs } from '@nestjs/config';
import Joi from 'joi';

const SEND_GRID_CONFIG_KEY = 'send-grid';

interface SendGridConfig {
  apiKey: string;
  fromEmail: string;
  inviteLink: string;
  resetPasswordLink: string;
}

export const sendGridConfig = registerAs(
  SEND_GRID_CONFIG_KEY,
  (): SendGridConfig => ({
    apiKey: process.env['SENDGRID_API_KEY']!,
    fromEmail: process.env['SENDGRID_FROM_EMAIL']!,
    inviteLink: process.env['SENDGRID_INVITE_LINK']!,
    resetPasswordLink: process.env['SENDGRID_RESET_PASSWORD_LINK']!
  })
);

export const sendGridValidationSchema = Joi.object({
  SENDGRID_API_KEY: Joi.string()
    .required()
    .description('SendGrid API Key'),
  SENDGRID_FROM_EMAIL: Joi.string()
    .required()
    .description('SendGrid From Email'),
  SENDGRID_INVITE_LINK: Joi.string()
    .required()
    .description('SendGrid Invite Link'),
  SENDGRID_RESET_PASSWORD_LINK: Joi.string()
    .required()
    .description('SendGrid Reset Password Link'),
});
