import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/postgresql'
import { wrap } from '@mikro-orm/core'
import axios from 'axios'

import { ListQueryParams, CreateData } from './term.types'

import { Term } from './term.entity'

import { TermDto } from './dtos/term.dto'
import { TermForTokenizationDto } from './dtos/termForTokenization.dto'
import { ListDto } from '../common/dtos/list.dto'
import { AddEntityResultDto } from '../common/dtos/addEntityResult.dto'
import { UpdateEntityResultDto } from '../common/dtos/updateEntityResult.dto'
import { DeleteEntityResultSuccessDto } from '../common/dtos/deleteEntityResultSuccess.dto'

@Injectable()
export class TermService {
  constructor(private readonly em: EntityManager) {}

  async list({ limit = 50, offset = 0 }: ListQueryParams) {
    try {
      const [terms, count] = await this.em.findAndCount(
        Term,
        {
          isActive: true
        },
        {
          limit,
          offset,
          populate: ['relations.relatedTerm'],
          orderBy: { createdAt: 'desc' }
        }
      )

      const data = terms.map((term) => new TermDto(term))

      return new ListDto(data, { count, limit, offset })
    } catch (e) {
      throw new HttpException(
        { success: false, message: e.message },
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async read(id: number) {
    try {
      const term = await this.em.findOneOrFail(
        Term,
        {
          id,
          isActive: true
        },
        {
          populate: ['relations.relatedTerm']
        }
      )

      return new TermDto(term)
    } catch (e) {
      throw new HttpException(
        { success: false, message: e.message },
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async readDefinition(id: number) {
    const terms = await this.getTermsForTokenization()

    try {
      const term = await this.em.findOneOrFail(
        Term,
        {
          id,
          isActive: true
        },
        {
          populate: ['relations.relatedTerm']
        }
      )
      const definition = await this.getTokens(terms, term.definition)

      return new TermDto({ ...term, definition })
    } catch (e) {
      throw new HttpException(
        { success: false, message: e.message },
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async create(data: CreateData) {
    try {
      const term = this.em.create(Term, data)

      await this.em.flush()

      return new AddEntityResultDto({
        data: { id: term.id, createdAt: term.createdAt }
      })
    } catch (e) {
      throw new HttpException(
        new AddEntityResultDto({
          errorMessage: e.message
        }),
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async update(id: number, data: CreateData) {
    const term = await this.em.findOne(Term, { id })

    if (!term) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: 'Specified term does not exist!'
        }),
        HttpStatus.BAD_REQUEST
      )
    }

    try {
      wrap(term).assign(data)
      await this.em.flush()

      return new UpdateEntityResultDto({
        data: { updatedAt: term.updatedAt }
      })
    } catch (e) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: e.message
        }),
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async delete(id: number) {
    const term = await this.em.findOne(Term, { id, isActive: true })

    if (!term) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: 'Specified term does not exist!'
        }),
        HttpStatus.BAD_REQUEST
      )
    }

    try {
      wrap(term).assign({ isActive: false })
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

  async getTermsForTokenization(documentId?: number) {
    const terms = await this.em.findAll(Term, {
      where: {
        isActive: true
      },
      orderBy: {
        analyzes: {
          frequency: 'desc'
        }
      },
      populate: ['relations.relatedTerm', 'analyzes']
    })

    return terms.map((term) => new TermForTokenizationDto(term, documentId))
  }

  async getTokens(terms: TermForTokenizationDto[], text?: string) {
    if (!text) {
      return undefined
    }

    try {
      const response = await axios.post(
        `${process.env.TERMS_API_URL}/tokenize`,
        {
          terms,
          text
        }
      )

      return response.data
    } catch {
      return text
    }
  }
}
