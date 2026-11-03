import { Column, DataType, Default, ForeignKey, Model, Table } from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.model';
import { IUserLinkedinAccount } from '../interfaces/user-linkedin-account.interface';

@Table({
  tableName: 'users_linkedin_accounts',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class UserLinkedinAccount extends Model<IUserLinkedinAccount> {
    @ApiProperty({
      example: '123e4567-e89b-12d3-a456-426614174000',
      description: 'User Linkedin account record ID',
    })
    @Column({
      type: DataType.UUID,
      primaryKey: true,
      defaultValue: DataType.UUIDV4,
    })
    id: string;

    @ApiProperty({
      description: 'User Linkedin account ID in Unipile',
    })
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    accountId: string;

    @ApiProperty({
      description: 'Is Linkedin Sales Navigator enabled',
    })
    @Default(false)
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
    })
    salesNavigator: boolean

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
