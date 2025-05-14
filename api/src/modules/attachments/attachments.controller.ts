import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  UseInterceptors
} from '@nestjs/common'

import { AttachmentData } from './attachment.types'

import AttachmentsService from './attachments.service'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/attachments')
export default class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Patch('/:attachmentId')
  async update(
    @Param('attachmentId', ParseIntPipe) id: number,
    @Body() body: AttachmentData
  ) {
    return await this.attachmentsService.updateAttachment(id, body)
  }

  @Delete('/:attachmentId')
  async delete(@Param('attachmentId', ParseIntPipe) id: number) {
    return await this.attachmentsService.deleteAttachment(id)
  }
}
