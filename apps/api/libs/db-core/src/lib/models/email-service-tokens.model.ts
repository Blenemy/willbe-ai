import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { IEmailServiceTokens } from '../interfaces/email-service-tokens.interface';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.model';

export enum EmailServiceType {
  GMAIL = 'gmail',
  OUTLOOK = 'outlook',
}

@Table({
  tableName: 'users_email_services_tokens',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class EmailServiceTokens extends Model<IEmailServiceTokens> {
    @ApiProperty({
      example: '123e4567-e89b-12d3-a456-426614174000',
      description: 'Email service tokens record ID',
    })
    @Column({
      type: DataType.UUID,
      primaryKey: true,
      defaultValue: DataType.UUIDV4,
    })
    id: string;

    @ApiProperty({
      description: 'Access token for email service',
    })
    @Column({
      type: DataType.STRING(2000),
      allowNull: true,
    })
    accessToken: string;

    @ApiProperty({
      description: 'Refresh token for email service',
    })
    @Column({
      type: DataType.STRING(1000),
      allowNull: true,
    })
    refreshToken: string;

    @ApiProperty({
      example: 'gmail',
      description: 'Email service type',
    })
    @Column({
      type: DataType.ENUM(EmailServiceType.GMAIL, EmailServiceType.OUTLOOK),
      allowNull: true,
    })
    type: EmailServiceType;

    @ApiProperty({
      example: '123e4567-e89b-12d3-a456-426614174000',
      description: 'User ID',
    })
    @ForeignKey(() => User)
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    userId: string;
}