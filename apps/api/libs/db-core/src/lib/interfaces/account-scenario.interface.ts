import { ApiProperty } from '@nestjs/swagger';

export interface IAccountScenario {
  id: string;
  name: string;
  userId: string;
  filterId: string;
}

export enum AccountScenarioFilterKey {
  INDUSTRY = 'industry',
  LOCATION = 'location',
  HEADCOUNT = 'headcount',
  HEADCOUNT_GROWTH = 'headcount_growth',
  FORTUNE = 'fortune',
  FOLLOWERS_COUNT = 'followers_count',
  RECENT_ACTIVITIES = 'recent_activities',
  HAS_JOB_OFFERS = 'has_job_offers',
  TECHNOLOGY = 'technology',
  NETWORK_DISTANCE = 'network_distance',
  KEYWORDS = 'keywords',
  DEPARTMENT_HEADCOUNT = 'department_headcount',
  DEPARTMENT_HEADCOUNT_GROWTH = 'department_headcount_growth',
  SAVED_ACCOUNTS = 'saved_accounts',
  ANNUAL_REVENUE = 'annual_revenue',
  ANNUAL_REVENUE_CURRENCY = 'annual_revenue_currency',
}

export class FindAccountsRes {
  @ApiProperty()
  type: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  profile_url: string;

  @ApiProperty()
  summary: string;

  @ApiProperty()
  industry: string;

  @ApiProperty()
  location: string | null;

  @ApiProperty()
  headcount: string;

  @ApiProperty()
  logo: string;

  @ApiProperty()
  founded_year?: string;

  @ApiProperty()
  headquarters?: string;

  @ApiProperty()
  website?: string;

  @ApiProperty()
  sales_navigator_url?: string;

  @ApiProperty()
  isSaved?: string;
}
