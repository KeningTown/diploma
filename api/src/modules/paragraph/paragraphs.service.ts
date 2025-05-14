import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager } from '@mikro-orm/postgresql'
import { EntityRepository, wrap } from '@mikro-orm/core'

import { AttachmentData } from '../attachments/attachment.types'
import { ParagraphData } from './paragraph.types'

import { Paragraph } from './paragraph.entity'
import { Attachment } from '../attachments/attachment.entity'

import { UpdateEntityResultDto } from '../common/dtos/updateEntityResult.dto'
import { DeleteEntityResultFailDto } from '../common/dtos/deleteEntityResultFail.dto'
import { DeleteEntityResultSuccessDto } from '../common/dtos/deleteEntityResultSuccess.dto'
import { AddEntityResultDto } from '../common/dtos/addEntityResult.dto'
import { AddEntityDataDto } from '../common/dtos/addEntityData.dto'

@Injectable()
export default class ParagraphsService {
  constructor(
    @InjectRepository(Paragraph)
    private readonly paragraphsRepository: EntityRepository<Paragraph>,
    private readonly em: EntityManager
  ) {}

  async updateParagraph(id: number, body: ParagraphData) {
    const paragraph = await this.em.findOne(Paragraph, { id: id })
    if (paragraph == null) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: 'Specified paragraph does not exist!'
        }),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      wrap(paragraph).assign(body)
      await this.em.flush()
      return new UpdateEntityResultDto({
        data: { updatedAt: paragraph.updatedAt }
      })
    } catch (e) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: 'Error description: ' + e.message
        }),
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async addParagraphAttachment(id: number, body: AttachmentData) {
    const paragraph = await this.paragraphsRepository.findOne(id)

    if (!paragraph) {
      throw new HttpException(
        new AddEntityResultDto({
          errorMessage: 'Specified paragraph does not exist!'
        }),
        HttpStatus.BAD_REQUEST
      )
    }

    try {
      body.paragraph = id

      const attachment = this.em.create(Attachment, body)

      await this.em.flush()

      return new AddEntityResultDto<
        AddEntityDataDto & {
          filename: string
        }
      >({
        data: {
          id: attachment.id,
          filename: attachment.filename,
          createdAt: attachment.createdAt
        }
      })
    } catch (e) {
      throw new HttpException(
        new AddEntityResultDto({
          errorMessage: 'Error description: ' + e.message
        }),
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async deleteParagraph(id: number) {
    const paragraph = await this.em.findOne(Paragraph, { id: id })
    if (paragraph == null) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Specified paragraph does not exist!'),
        HttpStatus.BAD_REQUEST
      )
    } else if (paragraph.deletedAt != undefined) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Specified paragraph already deleted!'),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      wrap(paragraph).assign({ deletedAt: new Date(), deletedBy: 1 })
      await this.em.flush()
      return new DeleteEntityResultSuccessDto()
    } catch (e) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Error description: ' + e.message),
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
