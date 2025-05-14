import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  Headers,
  UseGuards
} from '@nestjs/common'

import DocumentsService from './documents.service'

import { AddDocumentDto } from './dtos/addDocument.dto'
import { UpdateDocumentDto } from './dtos/updateDocument.dto'
import { AddDocumentBlockDto } from './dtos/addDocumentBlock.dto'

import { GetDocumentsQueryParams } from './query-params/getDocumentsQueryParams'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@Controller('api/documents')
export default class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async getDocuments(@Query() queryParams: GetDocumentsQueryParams) {
    return await this.documentsService.getDocuments(
      queryParams.limit,
      queryParams.offset
    )
  }

  @Get('/available')
  async getAvailableDocuments(
    @Headers() headers: Record<string, string>,
    @Query() queryParams: GetDocumentsQueryParams
  ) {
    return await this.documentsService.getAvailableDocuments(
      headers.authorization,
      queryParams.limit,
      queryParams.offset
    )
  }

  @Get('/:documentId')
  async getDocument(@Param('documentId', ParseIntPipe) id: number) {
    return await this.documentsService.getDocument(id)
  }

  @Get('/available/:documentId')
  async getAvailableDocument(@Param('documentId', ParseIntPipe) id: number) {
    return await this.documentsService.getDocument(id)
  }

  @Post()
  async addDocument(@Body() body: AddDocumentDto) {
    return await this.documentsService.addDocument(body)
  }

  @Patch('/:documentId')
  async updateDocument(
    @Param('documentId', ParseIntPipe) id: number,
    @Body() body: UpdateDocumentDto
  ) {
    return await this.documentsService.updateDocument(id, body)
  }

  @Delete('/:documentId')
  async deleteDocument(@Param('documentId', ParseIntPipe) id: number) {
    return await this.documentsService.deleteDocument(id)
  }

  @Get('/:documentId/groups')
  async getDocumentGroups(
    @Param('documentId', ParseIntPipe) id: number,
    @Query() queryParams: GetDocumentsQueryParams
  ) {
    return await this.documentsService.getDocumentGroups(
      id,
      queryParams.limit,
      queryParams.offset
    )
  }

  @Get('/:documentId/blocks')
  async getDocumentBlocks(
    @Param('documentId', ParseIntPipe) id: number,
    @Query() queryParams: GetDocumentsQueryParams
  ) {
    return await this.documentsService.getDocumentBlocks(
      id,
      queryParams.limit,
      queryParams.offset
    )
  }

  @Get('/available/:documentId/blocks')
  async getAvailableDocumentBlocks(
    @Headers() headers: Record<string, string>,
    @Param('documentId', ParseIntPipe) id: number,
    @Query() queryParams: GetDocumentsQueryParams
  ) {
    return await this.documentsService.getAvailableDocumentBlocks(
      headers.authorization,
      id,
      queryParams.limit,
      queryParams.offset
    )
  }

  @Post('/:documentId/blocks')
  async addDocumentBlock(
    @Param('documentId', ParseIntPipe) id: number,
    @Body() data: AddDocumentBlockDto
  ) {
    return await this.documentsService.addDocumentBlock(id, data)
  }
}
