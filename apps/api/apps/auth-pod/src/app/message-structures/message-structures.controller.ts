import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MessageStructuresService } from './message-structures.service';
import { CreateMessageStructureReq } from './dto/create-message-structure.dto';
import { CurrentUser, JwtAuthGuard } from '@willbe-server/shared-auth';
import { UpdateMessageStructureReq } from './dto/update-message-structure.dto';
import {
  ApiCloneMessageStructureDocs,
  ApiCreateMessageStructureDocs,
  ApiDeleteStructureDocs,
  ApiFindAllStructureDocs,
  ApiFindByIdStructureDocs,
  ApiUpdateStructureDocs,
} from '@willbe-server/swagger-docs';
import { FindMessageStructureDto } from './dto/find-message-structure.dto';
import { User } from '@willbe-server/db-core';

@UseGuards(JwtAuthGuard)
@Controller('message-structures')
export class MessageStructuresController {
  constructor(private readonly messageStructureService: MessageStructuresService) {}

  @Post()
  @ApiCreateMessageStructureDocs()
  async create(
    @Body() dto: CreateMessageStructureReq,
    @CurrentUser() user: User,
  ) {
    return await this.messageStructureService.create(dto, user.id);
  }

  @Post(':id/clone')
  @ApiCloneMessageStructureDocs()
  async clone(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.messageStructureService.clone(id, user.id);
  }

  @Get()
  @ApiFindAllStructureDocs()
  async findAll(
    @Query() dto: FindMessageStructureDto,
    @CurrentUser() user: User,
  ) {
    return await this.messageStructureService.find(dto, user.companyId);
  }

  @Get(':id')
  @ApiFindByIdStructureDocs()
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.messageStructureService.findById(id);
  }

  @Patch(':id')
  @ApiUpdateStructureDocs()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMessageStructureReq,
  ) {
    return await this.messageStructureService.update(id, dto);
  }

  @Delete(':id')
  @ApiDeleteStructureDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.messageStructureService.remove(id);
  }
}
