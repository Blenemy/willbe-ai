import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@willbe-server/shared-auth';
import {
  headcounts,
  fortunes,
  followersCounts,
  recentActivities,
  networkDistances,
  annualRevenues,
} from './constants/params.constants';
import { ApiGetAccountScenarioDropdownsDocs } from '@willbe-server/swagger-docs';

@UseGuards(JwtAuthGuard)
@Controller('account-scenarios-params')
export class AccountScenarioParamsController {

  @Get('dropdowns')
  @ApiGetAccountScenarioDropdownsDocs()
  getAccountScenarioDropdowns() {
    return {
      headcounts,
      fortunes,
      followersCounts,
      recentActivities,
      networkDistances,
      annualRevenues,
    };
  }
} 