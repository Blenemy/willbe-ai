import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchLinkedinParamsReq, SearchLinkedinParamsRes } from './dto/search-params.dto';
import { CurrentUser, JwtAuthGuard } from '@willbe-server/shared-auth';
import { ApiGetLanguagesDocs, ApiGetLeadScenarioDropdownsDocs, ApiSearchLinkedinParamsDocs } from '@willbe-server/swagger-docs';
import { companyHeadcounts, companyTypes, languages, networkDistances, seniorities, tenuresAtCompany, tenuresAtJobTitle, totalYearsOfExpirience } from './constants/params.constants';
import { UsersAccountsService } from '../users/users-accounts.service';
import { User } from '@willbe-server/db-core';
import { LinkedinProvider } from '../linkedin/linkedin.provider';

@UseGuards(JwtAuthGuard)
@Controller('scenario-params')
export class ScenarioParamsController {
  constructor(
    private readonly linkedinProvider: LinkedinProvider,
    private readonly usersAccountsService: UsersAccountsService,
  ) {}

  @Get()
  @ApiSearchLinkedinParamsDocs()
  async searchLinkedinParams(
    @Query() searchReq: SearchLinkedinParamsReq,
    @CurrentUser() user: User,
  ): Promise<SearchLinkedinParamsRes[]> {
    const accountId = await this.usersAccountsService.findLinkedinAccountId(user.id);
    return this.linkedinProvider.searchParameters(accountId, searchReq.type, searchReq.keywords);
  }

  @Get('languages')
  @ApiGetLanguagesDocs()
  getLanguages() {
    return languages;
  }

  @Get('dropdowns')
  @ApiGetLeadScenarioDropdownsDocs()
  getLeadScenarioDropdowns() {
    return {
      tenuresAtJobTitle,
      seniorities,
      totalYearsOfExpirience,
      networkDistances,
      companyHeadcounts,
      companyTypes,
      tenuresAtCompany,
    };
  }
}
