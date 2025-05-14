import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/postgresql'

import { CreateData } from './termRelation.types'

import { OPPOSITE_RELATION_TYPE } from './termRelation.constants'

import { TermRelation } from './termRelation.entity'

import { AddEntityResultDto } from '../common/dtos/addEntityResult.dto'
import { UpdateEntityResultDto } from '../common/dtos/updateEntityResult.dto'
import { DeleteEntityResultSuccessDto } from '../common/dtos/deleteEntityResultSuccess.dto'

@Injectable()
export class TermRelationService {
  constructor(private readonly em: EntityManager) {}

  async create(data: CreateData) {
    try {
      for (const item of data) {
        const term = item.termId
        const relatedTerm = item.relation.termId
        const type = item.relation.type
        const body = {
          term,
          relatedTerm,
          type
        }
        const termRelation = await this.em.findOne(TermRelation, body)

        if (!termRelation) {
          this.em.create(TermRelation, body)
        }

        const oppositeType = OPPOSITE_RELATION_TYPE[type]

        if (!oppositeType) continue

        const oppositeBody = {
          term: relatedTerm,
          relatedTerm: term,
          type: oppositeType
        }
        const oppositeTermRelation = await this.em.findOne(
          TermRelation,
          oppositeBody
        )

        if (!oppositeTermRelation) {
          this.em.create(TermRelation, oppositeBody)
        }
      }

      await this.em.flush()

      return new AddEntityResultDto({ data: null })
    } catch (e) {
      throw new HttpException(
        new AddEntityResultDto({
          errorMessage: e.message
        }),
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async delete(id: number) {
    try {
      const termRelation = await this.em.findOneOrFail(TermRelation, { id })

      await this.em.nativeDelete(TermRelation, { id: termRelation.id })

      const oppositeType = OPPOSITE_RELATION_TYPE[termRelation.type]
      const oppositeTermRelation = await this.em.findOne(TermRelation, {
        term: termRelation.relatedTerm,
        relatedTerm: termRelation.term,
        type: oppositeType
      })

      if (oppositeTermRelation) {
        await this.em.nativeDelete(TermRelation, {
          id: oppositeTermRelation.id
        })
      }

      await this.em.flush()

      return new DeleteEntityResultSuccessDto()
    } catch (e) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: e.message
        }),
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
