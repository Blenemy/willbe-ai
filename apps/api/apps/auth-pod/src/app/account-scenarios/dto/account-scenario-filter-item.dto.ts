import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AccountScenarioFilterKey, LeadScenarioFilterValue } from '@willbe-server/db-core';
import { IsFilterValue } from '../../lead-scenarios/decorators/is-filter-value.decorator';
import { Type } from 'class-transformer';

export class AccountScenarioFilterItem {
  @IsEnum(AccountScenarioFilterKey)
  filterKey: AccountScenarioFilterKey;

  @IsNotEmpty()
  filterValue: LeadScenarioFilterValue;
} 