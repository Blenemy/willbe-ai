import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Param,
  ParseUUIDPipe,
  Patch,
  Body,
  Redirect,
  Delete,
} from '@nestjs/common';
import { HubspotService } from './hubspot.service';
import { appProfileUrl } from '../app-urls';
import { CurrentUser, JwtAuthGuard } from '@willbe-server/shared-auth';
import { User } from '@willbe-server/db-core';
import { UpdateFieldsBindingsRequest } from './dto/update-fields-bindings.dto';
import {
  ApiConnectToHubspotDocs,
  ApiHubspotRedirectDocs,
  ApiSendAccountsDocs,
  ApiStartWithEnrichDocs,
  ApiStartWithoutEnrichDocs,
  ApiGetFieldsBindingsDocs,
  ApiUpdateFieldsBindingsDocs,
  ApiGetHubspotCompaniesTableFieldsDocs,
  ApiGetHubspotContactsTableFieldsDocs,
  ApiDisconnectFromHubspotDocs,
  ApiSyncAccountsDocs,
  ApiSyncLeadsDocs,
  ApiUpdateAutoSyncDocs,
} from '@willbe-server/swagger-docs';
import { HubspotSynchronizeService } from './hubspot-synchronize.service';
import { SyncAccountsReq, SyncLeadsReq, UpdateAutoSyncReq } from './dto/sync-dto';

@Controller('hubspot')
export class HubspotController {
  constructor(
    private readonly hubspotService: HubspotService,
    private readonly hubspotSynchronizeService: HubspotSynchronizeService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('connect')
  @ApiConnectToHubspotDocs()
  async connectToHubspot(@CurrentUser() user: User) {
    const url = this.hubspotService.connectToHubspot(user);
    return { url };
  }

  @Get('redirect')
  @Redirect()
  @ApiHubspotRedirectDocs()
  async authRedirect(
    @Query('code') code: string,
    @Query('state') userId: string,
  ) {
    await this.hubspotService.hubspotCallback(code, userId);
    return { url: appProfileUrl() };
  }

  @Delete('disconnect/:companyId')
  @ApiDisconnectFromHubspotDocs()
  async disconnectFromHubspot(@Param('companyId', ParseUUIDPipe) companyId: string) {
    return await this.hubspotService.disconnectFromHubspot(companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('start-with-enrich/:companyId')
  @ApiStartWithEnrichDocs()
  async startWithEnrich(@Param('companyId', ParseUUIDPipe) companyId: string) {
    return await this.hubspotSynchronizeService.initialSync(companyId, true);
  }

  @UseGuards(JwtAuthGuard)
  @Post('start-without-enrich/:companyId')
  @ApiStartWithoutEnrichDocs()
  async startWithoutEnrich(@Param('companyId', ParseUUIDPipe) companyId: string) {
    return await this.hubspotSynchronizeService.initialSync(companyId, false);
  }

  @UseGuards(JwtAuthGuard)
  @Get('fields-bindings/:companyId')
  @ApiGetFieldsBindingsDocs()
  async getFieldsBindings(@Param('companyId', ParseUUIDPipe) companyId: string) {
    return await this.hubspotService.getFieldsBindings(companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('fields-bindings/:companyId')
  @ApiUpdateFieldsBindingsDocs()
  async updateFieldsBindings(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Body() dto: UpdateFieldsBindingsRequest,
  ) {
    return await this.hubspotService.updateFieldsBindings(companyId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('companies-table-fields/:companyId')
  @ApiGetHubspotCompaniesTableFieldsDocs()
  async getHubspotCompaniesTableFields(@Param('companyId', ParseUUIDPipe) companyId: string) {
    return await this.hubspotService.getHubspotCompaniesTableFields(companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('contacts-table-fields/:companyId')
  @ApiGetHubspotContactsTableFieldsDocs()
  async getHubspotContactsTableFields(@Param('companyId', ParseUUIDPipe) companyId: string) {
    return await this.hubspotService.getHubspotContactsTableFields(companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sync-accounts')
  @ApiSyncAccountsDocs()
  async syncAccount(
    @Body() dto: SyncAccountsReq,
    @CurrentUser() user: User,
  ) {
    return await this.hubspotSynchronizeService.syncAccounts(dto.accountIds, user.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sync-leads')
  @ApiSyncLeadsDocs()
  async syncLead(
    @Body() dto: SyncLeadsReq,
    @CurrentUser() user: User,
  ) {
    return await this.hubspotSynchronizeService.syncLeads(dto.leadIds, user.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('auto-sync')
  @ApiUpdateAutoSyncDocs()
  async updateAutoSync(
    @Body() dto: UpdateAutoSyncReq,
    @CurrentUser() user: User,
  ) {
    return await this.hubspotSynchronizeService.updateAutoSync(dto, user.companyId);
  }
}
