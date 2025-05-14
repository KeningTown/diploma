import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository, wrap } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'
import axios from 'axios'
import * as fs from 'fs'

import { Document } from './document.entity'
import { DocumentsGroups } from '../documents-groups/documentsGroups.entity'
import { Block } from '../blocks/block.entity'
import { UsersGroups } from '../users-groups/users.groups.entity'
import { Record as RecordEntity } from '../record/record.entity'

import { PageDto } from '../common/dtos/page.dto'
import { DocumentDto } from './dtos/document.dto'
import { GetDocumentsDto } from './dtos/getDocuments.dto'
import { AddEntityResultDto } from '../common/dtos/addEntityResult.dto'
import { AddDocumentDto } from './dtos/addDocument.dto'
import { AddEntityDataDto } from '../common/dtos/addEntityData.dto'
import { UpdateEntityResultDto } from '../common/dtos/updateEntityResult.dto'
import { UpdateDocumentDto } from './dtos/updateDocument.dto'
import { DeleteEntityResultFailDto } from '../common/dtos/deleteEntityResultFail.dto'
import { DeleteEntityResultSuccessDto } from '../common/dtos/deleteEntityResultSuccess.dto'
import { DocumentsGroupsDto } from './dtos/documentsGroups.dto'
import { GetDocumentGroupsDto } from './dtos/getDocumentGroups.dto'
import { DocumentBlockDto } from './dtos/documentBlocks.dto'
import { GetDocumentBlocksDto } from './dtos/getDocumentBlocks.dto'
import { AddDocumentBlockDto } from './dtos/addDocumentBlock.dto'

import { AuthService } from '../auth/auth.service'
import { TermService } from '../term/term.service'
import { RECORDS_DIR } from '../record/record.service'

@Injectable()
export default class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: EntityRepository<Document>,
    private readonly em: EntityManager,
    private readonly authService: AuthService,
    private readonly termService: TermService
  ) {}

  async getDocuments(limit = 50, offset = 0) {
    const [documents, count] = await this.documentsRepository.findAndCount(
      {
        deletedAt: null
      },
      {
        limit,
        offset,
        orderBy: { createdAt: 'desc' }
      }
    )
    const documentsDtos = documents.map((document) => new DocumentDto(document))

    return new GetDocumentsDto(documentsDtos, new PageDto(count, limit, offset))
  }

  async getAvailableDocuments(authHeader: string, limit = 50, offset = 0) {
    const user = this.authService.getUserFromAuthHeader(authHeader)
    const userGroups = await this.em.findAll(UsersGroups, {
      where: { user: user.id }
    })
    const documentsGroups = await this.em.findAll(DocumentsGroups, {
      where: { group: { $in: userGroups.map(({ group }) => group.id) } }
    })
    const [documents, count] = await this.documentsRepository.findAndCount(
      {
        id: { $in: documentsGroups.map(({ document }) => document.id) },
        deletedAt: null
      },
      {
        limit,
        offset,
        orderBy: { createdAt: 'desc' }
      }
    )
    const documentsDtos = documents.map((document) => new DocumentDto(document))

    return new GetDocumentsDto(documentsDtos, new PageDto(count, limit, offset))
  }

  async getDocument(id: number) {
    try {
      const document = await this.documentsRepository.findOneOrFail(id)
      return new DocumentDto(document)
    } catch (e) {
      throw new HttpException(
        { success: false, message: e.message },
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async getDocumentGroups(id: number, limit = 50, offset = 0) {
    const [documentsGroups, count] = await this.em.findAndCount(
      DocumentsGroups,
      { document: id },
      { limit, offset, populate: ['group'], orderBy: { createdAt: 'desc' } }
    )
    const documentsGroupsDtos = documentsGroups.map(
      (documentsGroups) => new DocumentsGroupsDto(documentsGroups)
    )
    return new GetDocumentGroupsDto(
      documentsGroupsDtos,
      new PageDto(count, limit, offset)
    )
  }

  async getDistance(block: Block) {
    const data = {
      block: Object.fromEntries(
        block.paragraphs.map(({ id, text }) => [id, text])
      )
    }

    try {
      const response = await axios.post<Record<string, Record<string, number>>>(
        `${process.env.TERMS_API_URL}/distance`,
        data
      )

      return response.data
    } catch {
      return {}
    }
  }

  async getDocumentBlocks(id: number, limit = 50, offset = 0) {
    const [blocks, count] = await this.em.findAndCount(
      Block,
      {
        document: id,
        deletedAt: null
      },
      {
        limit,
        offset,
        populate: ['paragraphs.attachments'],
        populateWhere: {
          paragraphs: {
            deletedAt: null,
            attachments: {
              deletedAt: null
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    )
    const documentBlocksDtos = await Promise.all(
      blocks.map(async (block) => {
        const distance = await this.getDistance(block)

        return new DocumentBlockDto(block, distance)
      })
    )

    return new GetDocumentBlocksDto(
      documentBlocksDtos,
      new PageDto(count, limit, offset)
    )
  }

  async getAvailableDocumentBlocks(
    authHeader: string,
    id: number,
    limit = 50,
    offset = 0
  ) {
    const [blocks, count] = await this.em.findAndCount(
      Block,
      {
        document: id,
        deletedAt: null
      },
      {
        limit,
        offset,
        populate: ['paragraphs.attachments'],
        populateWhere: {
          paragraphs: {
            deletedAt: null,
            attachments: {
              deletedAt: null
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    )
    const terms = await this.termService.getTermsForTokenization(id)
    const user = this.authService.getUserFromAuthHeader(authHeader)
    const record = await this.em.findOne(
      RecordEntity,
      {
        user: user.id,
        document: id
      },
      {
        orderBy: { createdAt: 'desc' }
      }
    )

    let synonyms: unknown

    if (record) {
      try {
        const file = fs.readFileSync(
          `${RECORDS_DIR}/${record.filename}`,
          'utf-8'
        )
        const recordData = record && JSON.parse(file)

        synonyms = recordData && recordData.synonyms
      } catch (e) {
        console.error(e)
      }
    }

    const hasSynonyms = Boolean(synonyms && Object.keys(synonyms).length)
    const data = await Promise.all(
      blocks.map(async (item) => {
        const paragraphs = await Promise.all(
          item.paragraphs.map(async (item) => {
            const text = await this.termService.getTokens(terms, item.text)

            if (hasSynonyms) {
              text.forEach((token, i) => {
                if (typeof token === 'string' || !token.id) return

                const synonym = synonyms[token.id]

                if (!synonym) return

                const item = token.s?.find((item) => item.id === synonym)

                if (!item) return

                const s = item.s?.filter((item) => item.id !== synonym.id)

                text[i] = {
                  ...token,
                  ...item,
                  s
                }
              })
            }

            const attachments = item.attachments.map((item) => {
              return {
                id: item.id,
                filename: item.filename,
                type: item.type as unknown,
                title: item.title,
                description: item.description,
                order: item.order
              }
            })

            return {
              id: item.id,
              text,
              type: item.type as unknown,
              width: item.width as unknown,
              order: item.order,
              attachments
            }
          })
        )

        return {
          id: item.id,
          title: item.title,
          order: item.order,
          width: item.width as unknown,
          paragraphs
        }
      })
    )

    return {
      data,
      nav: {
        count,
        limit,
        offset
      }
    }
  }

  async addDocument(body: AddDocumentDto) {
    try {
      const document = this.documentsRepository.create(body)
      await this.em.flush()
      return new AddEntityResultDto<AddEntityDataDto>({
        data: { id: document.id, createdAt: document.createdAt }
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

  async addDocumentBlock(id: number, body: AddDocumentBlockDto) {
    const document = await this.documentsRepository.findOne(id)
    if (document == null) {
      throw new HttpException(
        new AddEntityResultDto({
          errorMessage: 'Specified document does not exist!'
        }),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      body.document = id
      const block = this.em.create(Block, body)
      await this.em.flush()
      return new AddEntityResultDto<AddEntityDataDto>({
        data: { id: block.id, createdAt: block.createdAt }
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

  async updateDocument(id: number, body: UpdateDocumentDto) {
    const document = await this.em.findOne(Document, { id: id })
    if (document == null) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: 'Specified document does not exist!'
        }),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      wrap(document).assign(body)
      await this.em.flush()
      return new UpdateEntityResultDto({
        data: { updatedAt: document.updatedAt }
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

  async deleteDocument(id: number) {
    const document = await this.em.findOne(Document, { id: id })
    if (document == null) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Specified document does not exist!'),
        HttpStatus.BAD_REQUEST
      )
    } else if (document.deletedAt != undefined) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Specified document already deleted!'),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      wrap(document).assign({ deletedAt: new Date(), deletedBy: 1 })
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
