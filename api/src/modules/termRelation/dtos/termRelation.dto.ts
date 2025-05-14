import { RelationType } from '../termRelation.types'

import { TermRelation } from '../termRelation.entity'

import { TermDto } from '../../term/dtos/term.dto'

export class TermRelationDto {
  id: number
  type: RelationType
  term: TermDto

  constructor({ id, type, relatedTerm }: TermRelation) {
    this.id = id
    this.type = type
    this.term = new TermDto({
      id: relatedTerm.id,
      term: relatedTerm.term,
      definition: relatedTerm.definition,
      isActive: relatedTerm.isActive
    })
  }
}
