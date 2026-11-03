import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  ParseBoolPipe,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { MessageEntriesService } from './message-entries.service';
import { CreateMessageEntryReq } from './dto/create-message-entry.dto';
import { UpdateMessageEntryReq } from './dto/update-message-entry.dto';
import { UpdateMessageEntryLeadDto } from './dto/update-message-entry-lead.dto';
import {
  ApiCreateMessageEntryDocs,
  ApiFindMessageEntryByIdDocs,
  ApiFindMessageEntriesDocs,
  ApiUpdateMessageEntryDocs,
  ApiRemoveMessageEntryDocs,
  ApiUpdateMessageEntryLeadDataDocs,
  ApiGetMessageEntryCsvDocs,
  ApiSerchEmailDocs,
  ApiSerchPhoneDocs,
  ApiSendMessagesDocs,
  ApiPullMessageEntryUpdatesDocs,
  ApiGenerateMessagesDocs,
  ApiUpdateFollowUpEntryDocs,
} from '@willbe-server/swagger-docs';
import { MessageEntriesDataIdsDto } from './dto/message-entries-ids.dto';
import { CurrentUser, JwtAuthGuard } from '@willbe-server/shared-auth';
import { User } from '@willbe-server/db-core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateFollowUpEntryDto } from './dto/update-follow-up-entry.dto';
import { BulkUpdateMessageEntryLeadsDto } from './dto/bulk-update-message-entry-leads.dto';

@Controller('message-campaign-entries')
export class MessageEntriesController {
  constructor(
    private readonly messageEntriesService: MessageEntriesService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreateMessageEntryDocs()
  async create(@Body() dto: CreateMessageEntryReq) {
    return await this.messageEntriesService.create(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiFindMessageEntryByIdDocs()
  async findById(@Param('id') id: string) {
    return await this.messageEntriesService.findById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiFindMessageEntriesDocs()
  async find(
    @Query('messageScenarioId', ParseUUIDPipe) messageScenarioId: string,
  ) {
    return await this.messageEntriesService.find(messageScenarioId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiUpdateMessageEntryDocs()
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMessageEntryReq,
  ) {
    return await this.messageEntriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveMessageEntryDocs()
  async remove(@Param('id') id: string) {
    return await this.messageEntriesService.remove(id);
  }

  @Patch('leads/bulk')
  @UseGuards(JwtAuthGuard)
  async bulkUpdateMessageEntryLeadData(@Body() dto: BulkUpdateMessageEntryLeadsDto) {
    return await this.messageEntriesService.bulkUpdateMessageEntryLeadData(dto);
  }

  @Post('search-language')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async searchLanguage(@Query('messageEntryLeadDataId', ParseUUIDPipe) messageEntryLeadDataId: string) {
    return await this.messageEntriesService.detectLeadLanguage(messageEntryLeadDataId);
  }

  @Patch('leads/:leadId')
  @UseGuards(JwtAuthGuard)
  @ApiUpdateMessageEntryLeadDataDocs()
  async updateMessageEntryLeadData(
    @Param('leadId', ParseUUIDPipe) leadId: string,
    @Body() dto: UpdateMessageEntryLeadDto,
  ) {
    return await this.messageEntriesService.updateMessageEntryLeadData(leadId, dto);
  }

  @Patch('follow-up/:id')
  @UseGuards(JwtAuthGuard)
  @ApiUpdateFollowUpEntryDocs()
  async updateFollowUpStructure(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFollowUpEntryDto,
  ) {
    return await this.messageEntriesService.updateFollowUpStructure(id, dto);
  }

  @Delete('leads')
  async removeMessageEntryLeadsData(@Body() dto: MessageEntriesDataIdsDto) {
    return await this.messageEntriesService.removeMessageEntryLeadsData(dto);
  }

  @Get(':id/csv')
  @UseGuards(JwtAuthGuard)
  @ApiGetMessageEntryCsvDocs()
  async getCsv(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
    @Query('withEmails', new ParseBoolPipe({ optional: true })) withEmails: boolean = false,
  ) {
    const messageEntry = await this.messageEntriesService.findById(id);
    const csvData = await this.messageEntriesService.getCsv(id, withEmails);

    if (!csvData) {
      res.status(HttpStatus.NOT_FOUND).send('No data available for CSV export.');
      return;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${messageEntry.messageScenario.name}.csv"`);

    res.status(HttpStatus.OK).send(csvData);
  }

  @Post('search-email')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiSerchEmailDocs()
  async searchEmail(
    @Body() dto: MessageEntriesDataIdsDto,
    @CurrentUser() user: User,
  ) {
    return await this.messageEntriesService.searchEmailOrPhone(dto, 'email', user.id);
  }

  @Post('search-email-result')
  @HttpCode(HttpStatus.OK)
  async searchEmailResult(@Body() body: any) {
    await this.messageEntriesService.searchEmailResult(body);
    return;
  }

  @Post('search-phone')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiSerchPhoneDocs()
  async searchPhone(
    @Body() dto: MessageEntriesDataIdsDto,
    @CurrentUser() user: User,
  ) {
    return await this.messageEntriesService.searchEmailOrPhone(dto, 'phone', user.id);
  }

  @Post('search-phone-result')
  @HttpCode(HttpStatus.OK)
  async searchPhoneResult(@Body() body: any) {
    await this.messageEntriesService.searchPhoneResult(body);
    return;
  }

  @Post('generate-messages')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiGenerateMessagesDocs()
  async generateMessages(
    @Body() dto: MessageEntriesDataIdsDto,
    @CurrentUser() user: User,
  ) {
    return await this.messageEntriesService.generateMessages(dto, user.id);
  }

  @Post('send-messages')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiSendMessagesDocs()
  async sendMessages(
    @Body() dto: MessageEntriesDataIdsDto,
    @CurrentUser() user: User,
  ) {
    return await this.messageEntriesService.sendMessages(dto, user);
  }

  @Get(':id/updates')
  @UseGuards(JwtAuthGuard)
  @ApiPullMessageEntryUpdatesDocs()
  async pullMessageEntryUpdates(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res,
  ) {
    const timeout = 30000;
    let resolved = false;

    const listener = async (data: any) => {
      if (!resolved) {
        resolved = true;
        
        const messageEntry = await this.messageEntriesService.findById(id);
        res.status(HttpStatus.OK).json(messageEntry);
      }
    };

    this.eventEmitter.once('MESSAGE_ENTRY_UPDATED', listener);

    setTimeout(() => {
      if (!resolved) {
        this.eventEmitter.removeListener('MESSAGE_ENTRY_UPDATED', listener);
        res.status(HttpStatus.NO_CONTENT).send();
      }
    }, timeout);
  }
}
