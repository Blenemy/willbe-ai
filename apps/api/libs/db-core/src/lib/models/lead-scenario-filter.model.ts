import { Model, BelongsTo, Table, Column, DataType, ForeignKey, HasMany } from 'sequelize-typescript';
import { ILeadScenarioFilter } from '../interfaces/lead-scenario-filter.interface';
import { systemSchema } from '../system-schema';
import { LeadScenarioModel } from './lead-scenario.model';
import { User } from './user.model';
import { LeadScenarioFilterValueModel } from './lead-scenario-filter-value.model';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'lead_scenarios_filters',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class LeadScenarioFilterModel extends Model<ILeadScenarioFilter> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Lead scenario filter ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: 'Filter',
    description: 'Lead scenario filter name',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.UUID,
    unique: false,
  })
  userId: string;

  @HasMany(() => LeadScenarioModel)
  leadScenarios: LeadScenarioModel[];

  @BelongsTo(() => User)
  user: User;

  @ApiProperty({
    type: LeadScenarioFilterValueModel,
    isArray: true,
  })
  @HasMany(() => LeadScenarioFilterValueModel)
  filterValues: LeadScenarioFilterValueModel[];
}