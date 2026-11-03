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
  UseGuards,
} from '@nestjs/common';
import { User } from '@willbe-server/db-core';
import { CurrentUser, JwtAuthGuard } from '@willbe-server/shared-auth';
import { CreateLeadScenarioFilterReq } from './dto/create-filter.dto';
import { LeadScenariosFiltersService } from './lead-scenarios-filters.service';
import { UpdateLeadScenarioFilterReq } from './dto/update-filter.dto';
import {
  ApiCreateLeadScenarioFilterDocs,
  ApiFindAllLeadScenarioFiltersDocs,
  ApiFindLeadScenarioFilterByIdDocs,
} from '@willbe-server/swagger-docs';

@UseGuards(JwtAuthGuard)
@Controller('lead-scenarios-filters')
export class LeadScenariosFiltersController {
  constructor(
    private readonly leadScenarioFiltersService: LeadScenariosFiltersService,
  ) {}

  @Post()
  @ApiCreateLeadScenarioFilterDocs()
  async create(
    @Body() dto: CreateLeadScenarioFilterReq,
    @CurrentUser() user: User,
  ) {
    return await this.leadScenarioFiltersService.create(dto, user.id);
  }

  @Get()
  @ApiFindAllLeadScenarioFiltersDocs()
  async findAll(@CurrentUser() user: User) {
    return await this.leadScenarioFiltersService.findAll(user.companyId);
  }

  @Get(':id')
  @ApiFindLeadScenarioFilterByIdDocs()
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.leadScenarioFiltersService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadScenarioFilterReq,
  ) {
    return await this.leadScenarioFiltersService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.leadScenarioFiltersService.remove(id);
  }
}