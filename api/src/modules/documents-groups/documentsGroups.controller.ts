import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'

import { DocumentGroupCollection } from './documentGroup.types'

import DocumentsGroupsService from './documentsGroups.service'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@Controller('api/documentsGroups')
export default class DocumentsGroupsController {
  constructor(
    private readonly documentsGroupsService: DocumentsGroupsService
  ) {}

  @Post()
  async addDocumentsGroups(@Body() body: DocumentGroupCollection) {
    return await this.documentsGroupsService.addDocumentsGroups(body)
  }

  @Delete('/:documentGroupId')
  async deleteDocumentGroup(
    @Param('documentGroupId', ParseIntPipe) id: number
  ) {
    return await this.documentsGroupsService.deleteDocumentGroup(id)
  }
}
