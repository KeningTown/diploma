import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import axios from 'axios'

import { ListQueryParams, AnalyzeResponse } from './termAnalysis.types'

import { RELATION_TYPE_MAP } from './termAnalysis.constants'

import { TermAnalysis } from './termAnalysis.entity'
import { Document } from '../documents/document.entity'
import { Term } from '../term/term.entity'
import { TermAnalysisTerm } from '../termAnalysisTerm/termAnalysisTerm.entity'

import { ListDto } from '../common/dtos/list.dto'
import { AddEntityResultDto } from '../common/dtos/addEntityResult.dto'
import { TermAnalysisDto } from './dtos/termAnalysis.dto'

import { TermRelationService } from '../termRelation/termRelation.service'

@Injectable()
export class TermAnalysisService {
  constructor(
    private readonly em: EntityManager,
    private readonly termRelationService: TermRelationService
  ) {}

  async analyzeDocuments(termAnalysis: TermAnalysis) {
    const documents = await this.em.findAll(Document, {
      where: {
        deletedAt: null
      },
      populate: ['blocks.paragraphs'],
      populateWhere: {
        blocks: {
          deletedAt: null,
          paragraphs: {
            deletedAt: null
          }
        }
      }
    })

    try {
      for (const document of documents) {
        const text = document.blocks
          .map(({ paragraphs }) => paragraphs.map(({ text }) => text).join(' '))
          .join(' ')

        const response = await axios.post<AnalyzeResponse>(
          `${process.env.TERMS_API_URL}/analyze`,
          { text }
        )

        for (const item of response.data) {
          let term = await this.em.findOne(Term, { term: item.term })

          if (!term) {
            term = this.em.create(Term, {
              term: item.term,
              isActive: false
            })
            await this.em.flush()
          }

          if (item.relations) {
            for (const relation of item.relations) {
              const type = RELATION_TYPE_MAP[relation.type]
              const data = await Promise.all(
                relation.terms.map(async (word) => {
                  let relatedTerm = await this.em.findOne(Term, { term: word })

                  if (!relatedTerm) {
                    relatedTerm = this.em.create(Term, {
                      term: word,
                      isActive: false
                    })
                    await this.em.flush()
                  }

                  return {
                    termId: term.id,
                    relation: {
                      termId: relatedTerm.id,
                      type
                    }
                  }
                })
              )

              await this.termRelationService.create(data)
            }
          }

          this.em.create(TermAnalysisTerm, {
            termAnalysis: termAnalysis.id,
            term: term.id,
            document: document.id,
            frequency: item.frequency
          })
          await this.em.flush()
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      wrap(termAnalysis).assign({ finished: true })
      await this.em.flush()
    }
  }

  async create() {
    try {
      const termAnalysis = this.em.create(TermAnalysis, { finished: false })

      await this.em.flush()

      this.analyzeDocuments(termAnalysis)

      return new AddEntityResultDto({
        data: { id: termAnalysis.id, createdAt: termAnalysis.createdAt }
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

  async list({ limit = 2, offset = 0 }: ListQueryParams) {
    try {
      const [termAnalyzes, count] = await this.em.findAndCount(
        TermAnalysis,
        {},
        {
          limit,
          offset,
          populate: ['terms.term.relations.relatedTerm'],
          orderBy: {
            createdAt: 'desc',
            terms: {
              frequency: 'desc'
            }
          }
        }
      )

      const data = termAnalyzes.map((item) => new TermAnalysisDto(item))

      return new ListDto(data, { count, limit, offset })
    } catch (e) {
      throw new HttpException(
        { success: false, message: e.message },
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
