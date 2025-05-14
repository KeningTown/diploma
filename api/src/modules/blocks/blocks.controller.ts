import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors
} from '@nestjs/common'

import { ParagraphData } from '../paragraph/paragraph.types'

import { UpdateBlockDto } from './dtos/updateBlock.dto'

import BlocksService from './blocks.service'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/blocks')
export default class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Patch('/:blockId')
  async updateBlock(
    @Param('blockId', ParseIntPipe) id: number,
    @Body() body: UpdateBlockDto
  ) {
    return await this.blocksService.updateBlock(id, body)
  }

  @Delete('/:blockId')
  async deleteBlock(@Param('blockId', ParseIntPipe) id: number) {
    return await this.blocksService.deleteBlock(id)
  }

  @Post('/:blockId/paragraphs')
  async addBlockParagraph(
    @Param('blockId', ParseIntPipe) id: number,
    @Body() data: ParagraphData
  ) {
    return await this.blocksService.addBlockParagraph(id, data)
  }
}
