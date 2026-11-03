import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ISearchLeadsResult } from '../interfaces/search-leads-result.interface';
import { ApiProperty } from '@nestjs/swagger';
import { systemSchema } from '../system-schema';
import { FindLeadsRes } from '../interfaces/lead-scenario.interface';
import { LeadScenarioModel } from './lead-scenario.model';

@Table({
  tableName: 'leads_search_results',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class SearchLeadsResult extends Model<ISearchLeadsResult> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Search lead result record ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    description: 'Search lead result',
    type: FindLeadsRes,
    isArray: true
  })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  data: any;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cursor which is used for search',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cursor: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Lead scenario ID',
  })
  @ForeignKey(() => LeadScenarioModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  leadScenarioId: string;
}
