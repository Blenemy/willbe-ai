import { Model, BelongsTo, Table, Column, DataType, ForeignKey, Default } from 'sequelize-typescript';
import { ILeadScenario } from '../interfaces/lead-scenario.interface';
import { systemSchema } from '../system-schema';
import { LeadScenarioFilterModel } from './lead-scenario-filter.model';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';

export enum ScenarioStatus {
  SEARCH = 'search',
  SELECT = 'select',
  SAVE = 'save',
}

@Table({
  tableName: 'lead_scenarios',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class LeadScenarioModel extends Model<ILeadScenario> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Lead scenario ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: 'CEOs',
    description: 'Lead scenario name',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: ScenarioStatus.SEARCH,
    description: 'Lead scenario status',
  })
  @Default(ScenarioStatus.SEARCH)
  @Column({
    type: DataType.ENUM(ScenarioStatus.SEARCH, ScenarioStatus.SELECT, ScenarioStatus.SAVE),
    allowNull: false,
  })
  status: ScenarioStatus;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Scenario creator user ID',
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: false,
  })
  userId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Filter ID selected for scenario',
  })
  @ForeignKey(() => LeadScenarioFilterModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    unique: false,
  })
  filterId: string;

  @BelongsTo(() => User)
  user: User;

  @ApiProperty({ type: LeadScenarioFilterModel })
  @BelongsTo(() => LeadScenarioFilterModel)
  filter: LeadScenarioFilterModel;
}

