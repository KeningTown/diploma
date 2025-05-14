import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
// import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager } from '@mikro-orm/postgresql'
import { wrap } from '@mikro-orm/core'

import { AttachmentData } from './attachment.types'

import { Attachment } from './attachment.entity'

import { UpdateEntityResultDto } from '../common/dtos/updateEntityResult.dto'
import { DeleteEntityResultFailDto } from '../common/dtos/deleteEntityResultFail.dto'
import { DeleteEntityResultSuccessDto } from '../common/dtos/deleteEntityResultSuccess.dto'

@Injectable()
export default class AttachmentsService {
  constructor(
    // @InjectRepository(Attachment)
    private readonly em: EntityManager
  ) {}

  async updateAttachment(id: number, body: AttachmentData) {
    const attachment = await this.em.findOne(Attachment, { id: id })
    if (attachment == null) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: 'Specified attachment does not exist!'
        }),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      wrap(attachment).assign(body)
      await this.em.flush()
      return new UpdateEntityResultDto({
        data: { updatedAt: attachment.updatedAt }
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

  async deleteAttachment(id: number) {
    const attachment = await this.em.findOne(Attachment, { id: id })
    if (attachment == null) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Specified attachment does not exist!'),
        HttpStatus.BAD_REQUEST
      )
    } else if (attachment.deletedAt != undefined) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Specified attachment already deleted!'),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      wrap(attachment).assign({ deletedAt: new Date(), deletedBy: 1 })
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
