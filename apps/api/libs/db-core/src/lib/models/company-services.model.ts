import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { ApiProperty } from '@nestjs/swagger';
import { ICompanyService } from '../interfaces/company-services.interface';
import { Company } from './company.model';

@Table({
  tableName: 'companies_products_and_services',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class CompanyProduct extends Model<ICompanyService> {
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
    example: 'Lead Generation',
    description: 'Name of comany product or service',
  })
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ApiProperty({
    example: 'A lead generation software that allows sales representatives',
    description: 'Description of comany product or service',
  })
  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @ApiProperty({
    example: 'A lead generation software that allows sales representatives',
    description: 'Short description of comany product or service',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  shortDescription: string | null;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Company ID',
  })
  @ForeignKey(() => Company)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  companyId: string;

  @BelongsTo(() => Company)
  company: Company;
}
