import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@willbe-server/shared-auth';
import { User } from '@willbe-server/db-core';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { HomeService } from './home.service';

class HomeIntervalQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3650)
  daysInterval?: number;
}

class HomeMeetingsQuery extends HomeIntervalQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}

@UseGuards(JwtAuthGuard)
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('meetings')
  async findMeetings(@Query() query: HomeMeetingsQuery, @CurrentUser() user: User) {
    return this.homeService.findMeetings(user.companyId, query);
  }

  @Get('meetings-responses-rate')
  async findMeetingsResponsesRate(@Query() query: HomeIntervalQuery, @CurrentUser() user: User) {
    return this.homeService.findMeetingsResponsesRate(user.companyId, query.daysInterval);
  }

  @Get('scenario-performance')
  async findScenarioPerformance(@Query() query: HomeIntervalQuery, @CurrentUser() user: User) {
    return this.homeService.findScenarioPerformance(user.companyId, query.daysInterval);
  }
}
