import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager } from '@mikro-orm/postgresql'
import { EntityRepository, wrap } from '@mikro-orm/core'

import { ParagraphData } from '../paragraph/paragraph.types'

import { Block } from './block.entity'
import { Paragraph } from '../paragraph/paragraph.entity'

import { UpdateEntityResultDto } from '../common/dtos/updateEntityResult.dto'
import { DeleteEntityResultFailDto } from '../common/dtos/deleteEntityResultFail.dto'
import { DeleteEntityResultSuccessDto } from '../common/dtos/deleteEntityResultSuccess.dto'
import { UpdateBlockDto } from './dtos/updateBlock.dto'
import { AddEntityResultDto } from '../common/dtos/addEntityResult.dto'
import { AddEntityDataDto } from '../common/dtos/addEntityData.dto'

@Injectable()
export default class BlocksService {
  constructor(
    @InjectRepository(Block)
    private readonly blocksRepository: EntityRepository<Block>,
    private readonly em: EntityManager
  ) {}

  async updateBlock(id: number, body: UpdateBlockDto) {
    const block = await this.em.findOne(Block, { id: id })
    if (block == null) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: 'Specified block does not exist!'
        }),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      wrap(block).assign(body)
      await this.em.flush()
      return new UpdateEntityResultDto({
        data: { updatedAt: block.updatedAt }
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

  async addBlockParagraph(id: number, body: ParagraphData) {
    const block = await this.blocksRepository.findOne(id)
    if (block == null) {
      throw new HttpException(
        new AddEntityResultDto({
          errorMessage: 'Specified block does not exist!'
        }),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      body.block = id
      const paragraph = this.em.create(Paragraph, body)
      await this.em.flush()
      return new AddEntityResultDto<AddEntityDataDto>({
        data: { id: paragraph.id, createdAt: paragraph.createdAt }
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

  async deleteBlock(id: number) {
    const block = await this.em.findOne(Block, { id: id })
    if (block == null) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Specified block does not exist!'),
        HttpStatus.BAD_REQUEST
      )
    } else if (block.deletedAt != undefined) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Specified block already deleted!'),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      wrap(block).assign({ deletedAt: new Date(), deletedBy: 1 })
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
