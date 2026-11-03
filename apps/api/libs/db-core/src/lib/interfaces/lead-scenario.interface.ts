import { ApiProperty } from '@nestjs/swagger';

export interface ILeadScenario {
  id: string;
  name: string;
  userId: string;
  filterId: string;
}

export enum LeadScenarioFilterKey {
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  LANGUAGE = 'language',
  JOB_TITLE = 'job_title',
  JOB_TENURE = 'job_tenure',
  PAST_JOB_TITLE = 'past_job_title',
  DEPARTMENT = 'department',
  SENIORITY = 'seniority',
  EXPERIENCE_YEARS = 'experience_years',
  SCHOOL = 'school',
  LOCATION = 'location',
  POSTED_ON_LINKEDIN = 'posted_on_linkedin',
  MENTIONED_IN_NEWS = 'mentioned_in_news',
  VIEWED_YOUR_PROFILE = 'viewed_your_profile',
  FOLLOWING_YOUR_COMPANY = 'following_your_company',
  PAST_COLLEAGUE = 'past_colleague',
  SHARED_EXPERIENCES = 'shared_experiences',
  NETWORK_DISTANCE = 'network_distance',
  CHANGED_JOBS = 'changed_jobs',
  KEYWORDS = 'keywords',
  PERSONA = 'persona',
  CURRENT_COMPANY = 'current_company',
  PAST_COMPANY = 'past_company',
  COMPANY_HEADCOUNT = 'company_headcount',
  COMPANY_INDUSTRY = 'company_industry',
  COMPANY_LOCATION = 'company_location',
  COMPANY_TYPE = 'company_type',
  COMPANY_TENURE = 'company_tenure'
}

export interface IFilterRange {
  from: string;
  to: string;
}

export interface IFilterSearchParam {
  id: string;
  title: string;
}

export interface IFilterIncludeExclude {
  include: string[] | IFilterSearchParam[];
  exclude: string[] | IFilterSearchParam[];
}

export type LeadScenarioFilterValue = string | string[] | boolean | IFilterRange | IFilterIncludeExclude;

class Tenure {
  @ApiProperty()
  years: number;

  @ApiProperty()
  months: number;
}

class CurrentPosition {
  @ApiProperty()
  company: string;

  @ApiProperty()
  company_id: string;

  @ApiProperty()
  location: string;

  @ApiProperty({ type: [String] })
  industry: string[];

  @ApiProperty()
  role: string;

  @ApiProperty({ type: Tenure })
  tenure_at_company: Tenure;

  @ApiProperty({ type: Tenure })
  tenure_at_role: Tenure;
}

export class FindLeadsRes {
  @ApiProperty()
  type: string;

  @ApiProperty()
  id: string;

  @ApiProperty({ nullable: true })
  industry: string | null;

  @ApiProperty()
  name: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  member_urn: string;

  @ApiProperty()
  public_identifier: string;

  @ApiProperty()
  public_profile_url: string;

  @ApiProperty()
  profile_url: string;

  @ApiProperty()
  profile_picture_url: string;

  @ApiProperty()
  profile_picture_url_large: string;

  @ApiProperty()
  network_distance: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  headline: string;

  @ApiProperty()
  summary: string;

  @ApiProperty()
  pending_invitation: boolean;

  @ApiProperty({ type: [CurrentPosition] })
  current_positions: CurrentPosition[];

  @ApiProperty()
  open_profile: boolean;

  @ApiProperty()
  premium: boolean;

  @ApiProperty()
  shared_connections_count: number;

  @ApiProperty()
  recent_posts_count: number;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  language?: string;

  @ApiProperty()
  location_country?: string;

  @ApiProperty()
  location_city?: string;
  
  @ApiProperty()
  position_description?: string;
}
