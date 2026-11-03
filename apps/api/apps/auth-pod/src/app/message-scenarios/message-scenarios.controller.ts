import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateMessageScenarioReq } from './dto/create-message-scenario.dto';
import { AddLeadsToMessageScenarioReq } from './dto/add-leads.dto';
import { messageScenariosMock } from './mocks/message-scenarios.mock';
import { CurrentUser, JwtAuthGuard } from '@willbe-server/shared-auth';
import { MessageEntryType, User } from '@willbe-server/db-core';
import { MessageScenariosService } from './message-scenarios.service';
import { UpdateMessageScenarioReq } from './dto/update-message-scenario.dto';
import {
  ApiCreateMessageScenarioDocs,
  ApiCreateMessageScenarioWithLeadsDocs,
  ApiFindMessageScenarioByIdDocs,
  ApiUpdateMessageScenarioDocs,
  ApiAddLeadsToMessageScenarioDocs,
  ApiRemoveLeadsFromMessageScenarioDocs,
  ApiFindMessageScenariosDocs,
  ApiRemoveMessageScenariosDocs,
  ApiGetScenarioStatisticsDocs,
  ApiGetScenarioMessagesDocs,
  ApiGetCadenceTimeframeDocs,
  ApiGetLeadsInCadenceDocs,
  ApiGetCsvDocs,
} from '@willbe-server/swagger-docs';
import { FindMessageScenariosDto } from './dto/find-message-scenarios.dto';
import { MessageEntriesService } from './message-entries.service';
import { MessageScenariosIdsDto } from './dto/message-scenarios-ids.dto';
import { CreateMessageScenarioWithLeadsReq } from './dto/create-message-scenario-with-leads.dto';

@UseGuards(JwtAuthGuard)
@Controller('message-scenarios')
export class MessageScenariosController {
  constructor(
    private readonly messageScenarioService: MessageScenariosService,
    private readonly messageEntriesService: MessageEntriesService,
  ) {}

  @Post()
  @ApiCreateMessageScenarioDocs()
  async create(
    @Body() dto: CreateMessageScenarioReq,
    @CurrentUser() user: User
  ) {
    return await this.messageScenarioService.create(dto, user.id);
  }

  @Post('create-with-leads')
  @ApiCreateMessageScenarioWithLeadsDocs()
  async createWithLeads(
    @Body() dto: CreateMessageScenarioWithLeadsReq,
    @CurrentUser() user: User
  ) {
    return await this.messageScenarioService.createWithLeads(dto, user.id);
  }

  @Patch(':id')
  @ApiUpdateMessageScenarioDocs()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMessageScenarioReq,
  ) {
    return await this.messageScenarioService.update(id, dto);
  }

  @Get()
  @ApiFindMessageScenariosDocs()
  async findAll(
    @Query() query: FindMessageScenariosDto,
    @CurrentUser() user: User,
  ) {
    return await this.messageScenarioService.find(query, user);
  }

  @Get(':id')
  @ApiFindMessageScenarioByIdDocs()
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.messageScenarioService.findById(id);
  }

  @Post(':id/add-leads')
  @HttpCode(HttpStatus.OK)
  @ApiAddLeadsToMessageScenarioDocs()
  async addLeadsToMessageScenario(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddLeadsToMessageScenarioReq
  ) {
    return await this.messageScenarioService.addLeadsToMessageScenario(id, dto);
  }

  @Delete(':id/remove-leads')
  @HttpCode(HttpStatus.OK)
  @ApiRemoveLeadsFromMessageScenarioDocs()
  async removeLeadFromMessageScenario(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddLeadsToMessageScenarioReq
  ) {
    return await this.messageScenarioService.removeLeadFromMessageScenario(id, dto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveMessageScenariosDocs()
  async removeScenarios(@Body() dto: MessageScenariosIdsDto) {
    return await this.messageScenarioService.removeMessageScenarios(dto);
  }

  @Get(':id/statistics')
  @ApiGetScenarioStatisticsDocs()
  async getScenarioStatistics(@Param('id', ParseUUIDPipe) id: string) {
    return await this.messageScenarioService.getScenarioStatistics(id);
  }

  @Get(':id/messages')
  @ApiGetScenarioMessagesDocs()
  async getMessages(@Param('id', ParseUUIDPipe) id: string) {
    return await this.messageScenarioService.getMessages(id);
  }

  @Get(':id/cadence-timeframe')
  @ApiGetCadenceTimeframeDocs()
  async getCadenceTimeframe(@Param('id', ParseUUIDPipe) id: string) {
    return await this.messageScenarioService.getCadenceTimeframe(id);
  }

  @Get(':id/leads-in-cadence')
  @ApiGetLeadsInCadenceDocs()
  async getLeadsInCadence(@Param('id', ParseUUIDPipe) id: string) {
    return await this.messageScenarioService.getLeadsInCadence(id);
  }

  @Get(':id/csv')
  @ApiGetCsvDocs()
  async getCsv(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('withEmails', ParseBoolPipe) withEmails: boolean = false,
  ) {
    return await this.messageScenarioService.getCsv(id, withEmails);
  }
}
