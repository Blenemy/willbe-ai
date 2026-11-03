import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { LeadScenarioFilterKey, LeadScenarioFilterValue } from '../interfaces/lead-scenario.interface';
import { systemSchema } from '../system-schema';
import { LeadScenarioFilterModel } from './lead-scenario-filter.model';
import { ApiProperty } from '@nestjs/swagger';
import { ILeadScenarioFilterValue } from '../interfaces/lead-scenario-filter-value.interface';

@Table({
  tableName: 'lead_scenarios_filters_values',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class LeadScenarioFilterValueModel extends Model<ILeadScenarioFilterValue> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Lead scenario filter value record ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Lead scenario filter ID',
  })
  @ForeignKey(() => LeadScenarioFilterModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: false,
  })
  filterId: string;

  @ApiProperty({
    example: 'first_name',
    description: 'Lead scenario filter key',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false,
  })
  filterKey: LeadScenarioFilterKey;

  @ApiProperty({
    example: 'Alex',
    description: 'Lead scenario filter key',
  })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    unique: false,
  })
  filterValue: LeadScenarioFilterValue;

  @BelongsTo(() => LeadScenarioFilterModel)
  filter: LeadScenarioFilterModel;
}