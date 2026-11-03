import { ICompany } from '../interfaces/company.interface';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.model';
import { CompanyProduct } from './company-services.model';
import { Invitation } from './invitation.model';

@Table({
  tableName: 'companies',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class Company extends Model<ICompany> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: 'Willbe',
    description: 'Company name',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;

  @ApiProperty({
    example: 'Willbe is a lead generation software',
    description: 'Company description',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ApiProperty({
    example: 'Willbe is a lead generation software',
    description: 'Short description of company',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  shortDescription: string | null;

  @ApiProperty({
    example: 'Software',
    description: 'Company sector',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  sector: string;

  @ApiProperty({
    example: true,
    description: 'Auto sync with CRM',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  autoSyncCrm: boolean;

  @HasMany(() => User, 'companyId')
  members: User[];

  @HasMany(() => CompanyProduct, 'companyId')
  products: CompanyProduct[];

  @HasMany(() => Invitation, 'companyId')
  invitations: Invitation[];
}
