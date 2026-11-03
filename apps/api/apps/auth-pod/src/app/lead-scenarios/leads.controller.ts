import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Body,
  Patch,
  UseGuards,
  HttpStatus,
  HttpCode,
  Post

} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { RemoveLeadsReq } from './dto/lead.dto';
import { CreateLeadReq, UpdateLeadReq } from './dto/update-lead.dto';
import { CurrentUser, JwtAuthGuard } from '@willbe-server/shared-auth';
import { ApiFindLeadByIdDocs, ApiUpdateLeadDocs, ApiRemoveLeadsDocs, ApiCreateLeadDocs } from '@willbe-server/swagger-docs';
import { User } from '@willbe-server/db-core';

@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get(':id')
  @ApiFindLeadByIdDocs()
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.leadsService.findById(id);
  }

  @Post()
  @ApiCreateLeadDocs()
  async createLead(
    @Body() dto: CreateLeadReq,
    @CurrentUser() user: User,
  ) {
    return await this.leadsService.createLead(dto, user.companyId);
  }

  @Patch(':id')
  @ApiUpdateLeadDocs()
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateLeadReq) {
    return await this.leadsService.update(id, dto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveLeadsDocs()
  async delete(@Body() dto: RemoveLeadsReq) {
    return await this.leadsService.delete(dto);
  }
}
  