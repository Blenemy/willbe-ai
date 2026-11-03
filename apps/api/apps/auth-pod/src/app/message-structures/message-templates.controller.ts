import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  Param,
  ParseUUIDPipe,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageTemplateReq } from './dto/create-message-template.dto';
import { FindMessageTemplateDto } from './dto/find-message-template.dto';
import { UpdateMessageTemplateReq } from './dto/update-message-template.dto';
import { JwtAuthGuard } from '@willbe-server/shared-auth';
import {
  ApiCreateMessageTemplateDocs,
  ApiFindOneMessageTemplateDocs,
  ApiUpdateMessageTemplateDocs,
  ApiDeleteMessageTemplateDocs,
  ApiFindExampleMessageTemplateDocs,
} from '@willbe-server/swagger-docs';
import { MessageTemplatesService } from './message-templates.service';
import { friendlyMessageTemplates } from './constants/message-templates.constants';
import { FindExampleTemplatesDto } from './dto/find-example-templates.dto';

@UseGuards(JwtAuthGuard)
@Controller('message-templates')
export class MessageTemplatesController {
  constructor(private readonly messageTemplatesService: MessageTemplatesService) {}
  
  @Post()
  @ApiCreateMessageTemplateDocs()
  async create(@Body() dto: CreateMessageTemplateReq) {
    if (dto?.translateFromLanguage) {
      return await this.messageTemplatesService.createFromExisting(dto);
    }
    return await this.messageTemplatesService.create(dto);
  }

  @Get()
  @ApiFindOneMessageTemplateDocs()
  async findOne(@Query() dto: FindMessageTemplateDto) {
    return await this.messageTemplatesService.findOne(dto);
  }

  @Patch(':id')
  @ApiUpdateMessageTemplateDocs()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMessageTemplateReq,
  ) {
    return await this.messageTemplatesService.update(id, dto);
  }

  @Delete(':id')
  @ApiDeleteMessageTemplateDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.messageTemplatesService.remove(id);
  }

  @Get('example-templates/friendly')
  @ApiFindExampleMessageTemplateDocs()
  async getTemplates(@Query() query: FindExampleTemplatesDto) {
    const template = friendlyMessageTemplates.find((t) => {
      return t.language === query.language && t.type === query.type;
    });

    if (!template) {
      throw new NotFoundException('Example template not found')
    }

    return template;
  }
}
