import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { ApiProperty } from '@nestjs/swagger';
import { IOutlookSubscription } from '../interfaces/outlook-subscription.interface';

@Table({
  tableName: 'outlook_subscriptions',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class OutlookSubscription extends Model<IOutlookSubscription> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Outlook subscription record ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Outlook subscription ID',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  subscriptionId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID',
  })
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  })
  userId: string;
}