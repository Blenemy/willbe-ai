import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@willbe-server/shared-auth';
import { CreateAccountScenarioReq } from './dto/create-account-scenario.dto';
import { FindAccountsRes, User } from '@willbe-server/db-core';
import { AccountScenariosService } from './account-scenarios.service';
import { UpdateAccountScenarioReq } from './dto/update-account-scenario.dto';
import { FindAccountScenariosQuery } from './dto/find-account-scenarios-query.dto';
import { FindAccountsQuery } from './dto/find-accounts.query';
import {
  ApiCreateAccountScenarioDocs,
  ApiFindAllAccountScenariosDocs,
  ApiFindAccountScenarioByIdDocs,
  ApiFindAccountsDocs,
  ApiRemoveAccountScenarioDocs,
  ApiUpdateAccountScenarioDocs,
  ApiSaveAccountsDocs,
  ApiFindSavedAccountsDocs,
  ApiRemoveSavedAccountDocs,
  ApiFindAllSavedAccountsDocs,
} from '@willbe-server/swagger-docs';
import { FindSavedAccountsDto } from './dto/find-saved-accounts.dto';

@UseGuards(JwtAuthGuard)
@Controller('account-scenarios')
export class AccountScenariosController {
  constructor(private readonly accountScenariosService: AccountScenariosService) {}

  @Post()
  @ApiCreateAccountScenarioDocs()
  async create(
    @Body() dto: CreateAccountScenarioReq,
    @CurrentUser() user: User,
  ) {
    return await this.accountScenariosService.create(dto, user.id);
  }

  @Get()
  @ApiFindAllAccountScenariosDocs()
  async findAllAccountScenarios(
    @CurrentUser() user: User,
    @Query() query: FindAccountScenariosQuery,
  ) {
    return await this.accountScenariosService.findAll(user.companyId, query);
  }

  @Get('saved-accounts')
  @ApiFindAllSavedAccountsDocs()
  async findAllSavedAccounts(
    @CurrentUser() user: User,
    @Query() query: FindSavedAccountsDto = {},
  ) {
    return await this.accountScenariosService.findAllSavedAccounts(user.companyId, query);
  }

  @Get(':id')
  @ApiFindAccountScenarioByIdDocs()
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.accountScenariosService.findById(id);
  }

  @Patch(':id')
  @ApiUpdateAccountScenarioDocs()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccountScenarioReq,
  ) {
    return await this.accountScenariosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveAccountScenarioDocs()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.accountScenariosService.remove(id);
  }

  @Get(':id/accounts')
  @ApiFindAccountsDocs()
  async findAccounts(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: FindAccountsQuery,
    @CurrentUser() user: User,
  ) {
    return await this.accountScenariosService.findAccounts(id, query, user.id);
  }

  @Post(':id/accounts')
  @ApiSaveAccountsDocs()
  async saveAccounts(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: { accounts: FindAccountsRes[] },
    @CurrentUser() user: User,
  ) {
    return await this.accountScenariosService.saveAccounts(id, dto, user.companyId);
  }

  @Get(':id/saved-accounts')
  @ApiFindSavedAccountsDocs()
  async findSavedAccounts(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.accountScenariosService.findSavedAccounts(id);
  }

  @Delete('saved-accounts/:accountId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveSavedAccountDocs()
  async removeSavedAccount(
    @Param('accountId', ParseUUIDPipe) accountId: string,
  ) {
    return await this.accountScenariosService.removeSavedAccount(accountId);
  }
} 