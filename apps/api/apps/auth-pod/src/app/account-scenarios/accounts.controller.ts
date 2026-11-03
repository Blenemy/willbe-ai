import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { UpdateAccountReq } from './dto/update-account.dto';
import {FindAccountLeadsReq, RemoveAccountsReq } from './dto/account.dto';
import {
  ApiFindAccountByIdDocs,
  ApiUpdateAccountDocs,
  ApiFindAccountLeadsDocs,
  ApiCreateAccountDocs,
  ApiRemoveAccountsDocs,
} from '@willbe-server/swagger-docs';
import { CurrentUser, JwtAuthGuard } from '@willbe-server/shared-auth';
import { User } from '@willbe-server/db-core';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get(':id')
  @ApiFindAccountByIdDocs()
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.accountsService.findById(id);
  }

  @Post()
  @ApiCreateAccountDocs()
  async createAccount(
    @Body() dto: UpdateAccountReq,
    @CurrentUser() user: User,
  ) {
    return await this.accountsService.createAccount(dto, user.companyId);
  }

  @Patch(':id')
  @ApiUpdateAccountDocs()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccountReq,
  ) {
    return await this.accountsService.update(id, dto);
  }

  @Get(':id/leads')
  @ApiFindAccountLeadsDocs()
  async findLeadsForAccount(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: FindAccountLeadsReq,
  ) {
    return await this.accountsService.findLeadsForAccount(id, query);
  }

  @Delete()
  @ApiRemoveAccountsDocs()
  async removeAccounts(@Body() dto: RemoveAccountsReq) {
    return await this.accountsService.removeAccounts(dto);
  }
}
