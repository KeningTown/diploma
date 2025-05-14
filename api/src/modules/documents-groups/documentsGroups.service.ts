import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'

import { DocumentGroupCollection } from './documentGroup.types'

import { DocumentsGroups } from './documentsGroups.entity'

import { AddEntityResultDto } from '../common/dtos/addEntityResult.dto'
import { DeleteEntityResultFailDto } from '../common/dtos/deleteEntityResultFail.dto'
import { DeleteEntityResultSuccessDto } from '../common/dtos/deleteEntityResultSuccess.dto'

@Injectable()
export default class DocumentsGroupsService {
  constructor(
    @InjectRepository(DocumentsGroups)
    private readonly documentsGroupsRepository: EntityRepository<DocumentsGroups>,
    private readonly em: EntityManager
  ) {}

  async addDocumentsGroups(body: DocumentGroupCollection) {
    try {
      const data = body.map(({ documentId: document, groupId: group }) =>
        this.documentsGroupsRepository.create({ document, group })
      )

      await this.em.flush()

      return new AddEntityResultDto({ data })
    } catch (e) {
      throw new HttpException(
        new AddEntityResultDto({
          errorMessage: 'Error description: ' + e.message
        }),
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async deleteDocumentGroup(id: number) {
    const documentGroup = await this.em.findOne(DocumentsGroups, { id })

    if (!documentGroup) {
      throw new HttpException(
        new DeleteEntityResultFailDto(
          'Specified document-group does not exist!'
        ),
        HttpStatus.BAD_REQUEST
      )
    }

    try {
      await this.em.nativeDelete(DocumentsGroups, { id })
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
