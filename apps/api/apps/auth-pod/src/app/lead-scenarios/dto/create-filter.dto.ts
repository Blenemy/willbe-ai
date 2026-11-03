import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum, ValidateNested, IsUUID } from 'class-validator';
import { LeadScenarioFilterKey, LeadScenarioFilterValue } from '@willbe-server/db-core';
import { IsFilterValue } from '../decorators/is-filter-value.decorator';
import { ValidateFilterFormat } from '../decorators/validate-filter-format.decorator';
import { Type } from 'class-transformer';

export class LeadScenarioFilterItem {
  @IsEnum(LeadScenarioFilterKey)
  filterKey: LeadScenarioFilterKey;

  @IsFilterValue()
  filterValue: LeadScenarioFilterValue;
}

export class CreateLeadScenarioFilterReq {
  @ApiProperty()
  @IsUUID()
  leadScenarioId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: [
      { filterKey: LeadScenarioFilterKey.FIRST_NAME, filterValue: 'John' },
      { filterKey: LeadScenarioFilterKey.LAST_NAME, filterValue: 'Doe' },
      { filterKey: LeadScenarioFilterKey.LANGUAGE, filterValue: ['English', 'Spanish', 'German'] },
      { filterKey: LeadScenarioFilterKey.LANGUAGE, filterValue: ['English', 'Spanish', 'German'] },
      {
        filterKey: LeadScenarioFilterKey.JOB_TITLE,
        filterValue: {
          include: [{ id: '123', title: 'Project Manager' }],
          exclude: [{ id: '456', title: 'Sales Manager' }],
        },
      },
      { filterKey: LeadScenarioFilterKey.JOB_TENURE, filterValue: { from: '1', to: '3' } },
      {
        filterKey: LeadScenarioFilterKey.PAST_JOB_TITLE,
        filterValue: {
          include: [{ id: '123', title: 'Project Manager' }],
          exclude: [{ id: '456', title: 'Sales Manager' }],
        },
      },
      {
        filterKey: LeadScenarioFilterKey.SENIORITY,
        filterValue: {
          include: ['owner/partner', 'cxo'],
          exclude: ['in_training', 'entry_level'],
        },
      },
      { filterKey: LeadScenarioFilterKey.EXPERIENCE_YEARS, filterValue: { from: '1', to: '5' } },
      {
        filterKey: LeadScenarioFilterKey.SCHOOL,
        filterValue: {
          include: [
            {
                title: "Information Technology Institute (ITI)",
                id: "294614"
            }
          ],
          exclude: [
            {
                title: "IT Academy",
                id: "15248534"
            },
          ],
        },
      },
      {
        filterKey: LeadScenarioFilterKey.LOCATION,
        filterValue: {
          include: [{ title: 'Kyiv, Kyiv City, Ukraine', 'id': '104035893' }],
          exclude: [{ title: 'Kharkiv, Ukraine', 'id': '101458149' }],
        },
      },
      { filterKey: LeadScenarioFilterKey.POSTED_ON_LINKEDIN, filterValue: true },
      { filterKey: LeadScenarioFilterKey.MENTIONED_IN_NEWS, filterValue: true },
      { filterKey: LeadScenarioFilterKey.VIEWED_YOUR_PROFILE, filterValue: true },
      { filterKey: LeadScenarioFilterKey.FOLLOWING_YOUR_COMPANY, filterValue: true },
      { filterKey: LeadScenarioFilterKey.PAST_COLLEAGUE, filterValue: true },
      { filterKey: LeadScenarioFilterKey.SHARED_EXPERIENCES, filterValue: true },
      { filterKey: LeadScenarioFilterKey.NETWORK_DISTANCE, filterValue: '1' },
      { filterKey: LeadScenarioFilterKey.CHANGED_JOBS, filterValue: true },
      { filterKey: LeadScenarioFilterKey.KEYWORDS, filterValue: 'some keywords here' },
      { 
        filterKey: LeadScenarioFilterKey.CURRENT_COMPANY,
        filterValue: {
          include: [
            {
              title: "Google",
              id: "1441",
            },
          ],
          exclude: [
            {
              'title': "Microsoft",
              'id': "1035"
            },
          ],
        },
      },
      { 
        filterKey: LeadScenarioFilterKey.PAST_COMPANY,
        filterValue: {
          include: [
            {
              title: "Google",
              id: "1441",
            },
          ],
          exclude: [
            {
              'title': "Microsoft",
              'id': "1035"
            },
          ],
        },
      },
      { filterKey: LeadScenarioFilterKey.COMPANY_HEADCOUNT, filterValue: { from: '501', to: '1000' } },
      { 
        filterKey: LeadScenarioFilterKey.COMPANY_INDUSTRY,
        filterValue: {
          include: [
            {
              title: "Software Development",
              id: "4"
            },
          ],
          exclude: [
            {
              title: "Data Security Software Products",
              id: "3130"
            }
          ],
        },
      },
      {
        filterKey: LeadScenarioFilterKey.COMPANY_LOCATION,
        filterValue: {
          include: [{ title: 'Kyiv, Kyiv City, Ukraine', 'id': '104035893' }],
          exclude: [{ title: 'Kharkiv, Ukraine', 'id': '101458149' }],
        },
      },
      { filterKey: LeadScenarioFilterKey.COMPANY_TYPE, filterValue: ['Public company'] },
      { filterKey: LeadScenarioFilterKey.COMPANY_TENURE, filterValue: { from: '1', to: '3' } },
    ],
  })
  @Type(() => LeadScenarioFilterItem)
  @ValidateNested()
  @IsArray()
  @IsOptional()
  filterValues?: LeadScenarioFilterItem[];
}