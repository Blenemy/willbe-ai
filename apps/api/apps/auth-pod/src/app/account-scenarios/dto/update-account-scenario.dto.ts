import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AccountScenarioFilterItem } from './account-scenario-filter-item.dto';

export class UpdateAccountScenarioReq {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: [
      {
        filterKey: 'industry',
        filterValue: {
          include: [{ 'title': 'Software Development', 'id': '4' }],
          exclude: [{ 'title': 'International Trade and Development', 'id': '141' }],
        },
      },
      {
        filterKey: 'location',
        filterValue: {
          include: [{ 'title': 'Kyiv, Kyiv City, Ukraine', 'id': '104035893' }],
          exclude: [{ 'title': 'Kharkiv, Ukraine', 'id': '101458149' }],
        },
      },
      { filterKey: 'headcount', filterValue: { from: '501', to: '1000' } },
      { filterKey: 'headcount_growth', filterValue: { from: '30', to: '70' } },
      { filterKey: 'fortune', filterValue: { from: '51', to: '100' } },
      { filterKey: 'followers_count', filterValue: { from: '101', to: '1000' } },
      { filterKey: 'recent_activities', filterValue: { 'title': 'Funding Events', 'value': 'funding_events'} },
      { filterKey: 'has_job_offers', filterValue: true },
      { filterKey: 'technology', filterValue: [
        {'id': '1097', 'title': 'Google Analytics' },
        {'id': '16538', 'title': 'Google Marketing Platform' },
        ],
      },
      { filterKey: 'network_distance', filterValue: '1' },
      { filterKey: 'keywords', filterValue: 'some keywords here' },
      { filterKey: 'department_headcount', filterValue: { from: '10', to: '200' } },
      { filterKey: 'department_headcount_growth', filterValue: { from: '20', to: '50' } },
      { filterKey: 'saved_accounts', filterValue: [{ 'title': 'Apple', 'id': '120' }] },
      { filterKey: 'annual_revenue', filterValue: { from: '1', to: '5' } },
      { filterKey: 'annual_revenue_currency', filterValue: 'USD' },
    ],
  })
  @Type(() => AccountScenarioFilterItem)
  @ValidateNested()
  @IsArray()
  @IsOptional()
  filterValues?: AccountScenarioFilterItem[];
} 