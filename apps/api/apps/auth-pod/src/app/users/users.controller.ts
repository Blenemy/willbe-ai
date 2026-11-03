import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserReq } from './dto/update-user.dto';
import { UpdateUserPasswordReq } from './dto/update-user-password.dto';
import { CurrentUser, JwtAuthGuard } from '@willbe-server/shared-auth';
import {
  ApiFindEmailSignatureDocs,
  ApiUpdateEmailSignatureDocs,
  ApiUpdateUserDocs,
  ApiUpdateUserPasswordDocs,
} from '@willbe-server/swagger-docs';
import { User } from '@willbe-server/db-core';
import { UpdateEmailSignatureReq } from './dto/update-email-signature.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  @ApiUpdateUserDocs()
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateUserReq,
    @CurrentUser() user: User,
  ) {
    if (user.id !== id) {
      throw new ForbiddenException('Unable to update user');
    }
    return await this.usersService.update(id, dto);
  }

  @Put(':id/password')
  @ApiUpdateUserPasswordDocs()
  async updatePassword(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateUserPasswordReq,
    @CurrentUser() user: User,
  ) {
    if (user.id !== id) {
      throw new ForbiddenException('Unable to update user');
    }
    return await this.usersService.updatePasswordWithValidation(id, dto);
  }

  @Get(':id/email-signature')
  @ApiFindEmailSignatureDocs()
  async findEmailSignature(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.usersService.findEmailSignature(id);
  }

  @Put(':id/email-signature')
  @ApiUpdateEmailSignatureDocs()
  async updateEmailSignature(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateEmailSignatureReq,
    @CurrentUser() user: User,
  ) {
    if (user.id !== id) {
      throw new ForbiddenException('Unable to update user');
    }
    return await this.usersService.updateEmailSignature(id, dto);
  }
}
