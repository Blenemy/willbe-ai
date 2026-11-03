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
import { CreateLeadScenarioReq } from './dto/create-lead-scenario.dto';
import { FindLeadsRes, User } from '@willbe-server/db-core';
import { LeadScenariosService } from './lead-scenarios.service';
import { UpdateLeadScenarioReq } from './dto/update-lead-scenario.dto';
import { FindLeadScenariosQuery } from './dto/find-lead-scenarios-query.dto';
import {
  ApiCreateLeadScenarioDocs,
  ApiFindAllLeadScenariosDocs,
  ApiFindLeadScenarioByIdDocs,
  ApiFindLeadsDocs,
  ApiFindSavedLeadsDocs,
  ApiRemoveLeadScenarioDocs,
  ApiSaveLeadsDocs,
  ApiUpdateLeadScenarioDocs,
  ApiRemoveSavedLeadDocs,
  ApiGenerateLeadScenarioDocs,
  ApiFindLeadsByAccountsAndScenariosDocs,
} from '@willbe-server/swagger-docs';
import { FindLeadsQuery } from './dto/find-leads.dto';
import { GenerateLeadScenarioReq } from '../account-scenarios/dto/generate-lead-scenario.dto';
import { FindLeadsByAccountsAndScenariosReq } from './dto/find-leads-by-accounts.dto';

@UseGuards(JwtAuthGuard)
@Controller('lead-scenarios')
export class LeadScenariosController {
  constructor(private readonly leadScenariosService: LeadScenariosService) {}

  @Post()
  @ApiCreateLeadScenarioDocs()
  async create(
    @Body() dto: CreateLeadScenarioReq,
    @CurrentUser() user: User,
  ) {
    return await this.leadScenariosService.create(dto, user.id);
  }

  @Get()
  @ApiFindAllLeadScenariosDocs()
  async findAllLeadScenarios(
    @CurrentUser() user: User,
    @Query() query: FindLeadScenariosQuery,
  ) {
    return await this.leadScenariosService.findAll(user.companyId, query);
  }

  @Get(':id')
  @ApiFindLeadScenarioByIdDocs()
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.leadScenariosService.findById(id);
  }

  @Patch(':id')
  @ApiUpdateLeadScenarioDocs()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadScenarioReq,
  ) {
    return await this.leadScenariosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveLeadScenarioDocs()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.leadScenariosService.remove(id);
  }

  @Get(':id/leads')
  @ApiFindLeadsDocs()
  async findLeads(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: FindLeadsQuery,
    @CurrentUser() user: User,
  ) {
    return await this.leadScenariosService.findLeads(id, query, user.id);
  }

  @Post(':id/leads')
  @ApiSaveLeadsDocs()
  async saveLeads(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: { leads: FindLeadsRes[] },
    @CurrentUser() user: User,
  ) {
    // TODO: add dto validation
    return await this.leadScenariosService.saveLeads(id, dto, user.companyId, user.id);
  }

  @Get(':id/saved-leads')
  @ApiFindSavedLeadsDocs()
  async findSavedLeads(@Param('id', ParseUUIDPipe) id: string) {
    return await this.leadScenariosService.findSavedLead(id);
  }

  @Delete('saved-leads/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveSavedLeadDocs()
  async removeSavedLead(@Param('id', ParseUUIDPipe) id: string) {
    await this.leadScenariosService.removeSavedLead(id);
  }

  @Post('/create-with-accounts')
  @ApiGenerateLeadScenarioDocs()
  async createLeadScenarioWithAccounts(
    @Body() dto: GenerateLeadScenarioReq,
    @CurrentUser() user: User,
  ) {
    return await this.leadScenariosService.createLeadScenarioWithAccounts(dto, user.id);
  }

  @Post('/leads-by-accounts-and-scenarios')
  @HttpCode(HttpStatus.OK)
  @ApiFindLeadsByAccountsAndScenariosDocs()
  async findLeadsByAccountsAndScenarios(
    @Body() dto: FindLeadsByAccountsAndScenariosReq,
  ) {
    return await this.leadScenariosService.findLeadsByAccountsAndScenarios(dto);
  }
}
