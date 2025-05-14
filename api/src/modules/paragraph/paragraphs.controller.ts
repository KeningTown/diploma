import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { diskStorage } from 'multer'

import { AttachmentData } from '../attachments/attachment.types'
import { ParagraphData } from './paragraph.types'

import ParagraphsService from './paragraphs.service'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@Controller('api/paragraphs')
export default class ParagraphsController {
  constructor(private readonly paragraphsService: ParagraphsService) {}

  @Patch('/:paragraphId')
  async updateParagraph(
    @Param('paragraphId', ParseIntPipe) id: number,
    @Body() body: ParagraphData
  ) {
    return await this.paragraphsService.updateParagraph(id, body)
  }

  @Post('/:paragraphId/attachments')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (_, file, cb) => {
          const originalName = Buffer.from(
            file.originalname,
            'latin1'
          ).toString('utf8')
          const fileName = `${Date.now()}_${originalName}`

          cb(null, fileName)
        }
      })
    })
  )
  async addParagraphAttachment(
    @Param('paragraphId', ParseIntPipe) id: number,
    @Body()
    data: Omit<AttachmentData, 'filename'> & {
      file: Express.Multer.File
    },
    @UploadedFile() file: Express.Multer.File
  ) {
    const body = {
      ...data,
      filename: file.filename
    }

    delete body.file

    return await this.paragraphsService.addParagraphAttachment(id, body)
  }

  @Delete('/:paragraphId')
  async deleteParagraph(@Param('paragraphId', ParseIntPipe) id: number) {
    return await this.paragraphsService.deleteParagraph(id)
  }
}
