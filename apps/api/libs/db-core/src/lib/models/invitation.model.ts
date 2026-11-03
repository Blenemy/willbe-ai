import { Column, DataType, Default, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { IInvitation } from '../interfaces/invitation.interface';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../interfaces/user.interface';
import { Company } from './company.model';

@Table({
  tableName: 'users_invitations',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class Invitation extends Model<IInvitation> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Invitation ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Invited user email',
    uniqueItems: true,
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: 'member',
    description: 'Invited user role in the system',
  })
  @Column({
    type: DataType.ENUM(UserRole.ADMIN, UserRole.MEMBER),
    allowNull: false,
  })
  role: UserRole;

  @ApiProperty({
    example: 'Lead generation manager',
    description: 'Invited user position in the company',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  position: string;

  @ApiProperty({
    example: false,
    description: 'Is invitation accepted',
  })
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isAccepted: boolean;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Company invite ID',
  })
  @ForeignKey(() => Company)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  companyId: string;
}
