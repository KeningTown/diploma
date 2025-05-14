import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Body,
  Post,
  Headers,
  UseGuards,
  UploadedFile
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { diskStorage } from 'multer'

import { ListQueryParams, CreateData } from './record.types'

import { RecordService } from './record.service'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@Controller('api/records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  async list(@Query() params: ListQueryParams) {
    return await this.recordService.list(params)
  }

  @Get('/:recordId')
  async read(@Param('recordId', ParseIntPipe) id: number) {
    return await this.recordService.read(id)
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './records',
        filename: (_, __, cb) => {
          const fileName = `record_${Date.now()}.json`

          cb(null, fileName)
        }
      })
    })
  )
  async create(
    @Headers() headers: Record<string, string>,
    @Body() data: CreateData,
    @UploadedFile() { filename }: Express.Multer.File
  ) {
    return await this.recordService.create(headers.authorization, {
      ...data,
      filename
    })
  }
}
