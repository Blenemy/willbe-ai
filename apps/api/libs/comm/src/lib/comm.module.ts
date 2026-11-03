import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { CommEmailService } from './comm-email.service';
import {
  sendGridConfig,
  sendGridValidationSchema,
} from './config/send-grid.config';

const validationSchema = Joi.object().concat(sendGridValidationSchema);

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [sendGridConfig],
      validationSchema: validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
  controllers: [],
  providers: [CommEmailService],
  exports: [CommEmailService],
})
export class CommModule {}
