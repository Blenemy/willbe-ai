import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.model';
import { IEmailSignature } from '../interfaces/email-signature.interface';


@Table({
  tableName: 'users_email_signatures',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class EmailSignature extends Model<IEmailSignature> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Email signature ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    description: 'Email signature body',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  body: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID',
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  
  })
  userId: string;
}
