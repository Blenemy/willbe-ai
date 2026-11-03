import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CompanyUsersService } from './company-users.service';
import { AbilityService, CurrentUser, JwtAuthGuard } from '@willbe-server/shared-auth';
import { CreateInvitationReq } from './dto/create-invitation.dto';
import { AcceptInvitationReq } from './dto/accept-invitation.dto';
import { UpdateCompanyUserReq } from './dto/update-company-user.dto';
import {
  ApiAcceptInvitationDocs,
  ApiCreateInvitationDocs,
  ApiFindAllUsersForCompanyDocs,
  ApiFindInvitationByIdDocs,
  ApiRemoveCompanyUserDocs,
  ApiUpdateCompanyUserDocs,
} from '@willbe-server/swagger-docs';
import { User } from '@willbe-server/db-core';
import { UsersService } from './users.service';
import { CompaniesService } from '../companies/companies.service';

@Controller('company-users')
export class CompanyUsersController {
  constructor(
    private readonly companyUsersService: CompanyUsersService,
    private readonly companyService: CompaniesService,
    private readonly usersService: UsersService,
    private readonly abilityService: AbilityService,
  ) {}

  @Get(':companyId')
  @UseGuards(JwtAuthGuard)
  @ApiFindAllUsersForCompanyDocs()
  async findAll(@Param('companyId', ParseUUIDPipe) companyId: string) {
    return await this.companyUsersService.findAll(companyId);
  }

  @Post(':companyId/invitations')
  @UseGuards(JwtAuthGuard)
  @ApiCreateInvitationDocs()
  async createInvitation(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Body() dto: CreateInvitationReq,
    @CurrentUser() user: User,
  ) {
    const company = await this.companyService.findById(companyId);
    this.abilityService.checkUpdateCompanyAbility(user, company);
    return await this.companyUsersService.createInvitation(companyId, dto);
  }

  // TODO: create public route decorator
  @Get('invitations/:invitationId')
  @ApiFindInvitationByIdDocs()
  async getInvitation(
    @Param('invitationId', ParseUUIDPipe) invitationId: string
  ) {
    return await this.companyUsersService.findInvitationById(invitationId);
  }

  // TODO: create public route decorator
  @Post('invitations/:invitationId')
  @ApiAcceptInvitationDocs()
  async acceptInvitation(
    @Param('invitationId', ParseUUIDPipe) invitationId: string,
    @Body() dto: AcceptInvitationReq
  ) {
    return await this.companyUsersService.acceptInvitation(invitationId, dto);
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiUpdateCompanyUserDocs()
  async update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateCompanyUserReq,
    @CurrentUser() user: User,
  ) {
    const userToUpdate = await this.usersService.findById(userId);
    this.abilityService.checkManageCompanyUsersAbility(user, userToUpdate);
    return await this.companyUsersService.update(userId, dto);
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiRemoveCompanyUserDocs()
  async remove(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() user: User,
  ) {
    const userToRemove = await this.usersService.findById(userId);
    this.abilityService.checkManageCompanyUsersAbility(user, userToRemove);
    return await this.companyUsersService.remove(userId);
  }
}
