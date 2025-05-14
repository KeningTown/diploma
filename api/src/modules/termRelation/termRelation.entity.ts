import { Entity, Enum, ManyToOne } from '@mikro-orm/core'

import { RelationType } from './termRelation.types'

import { BaseEntity } from '../common/base.entity'
import { Term } from '../term/term.entity'

@Entity({ tableName: 'terms_relations' })
export class TermRelation extends BaseEntity {
  @ManyToOne({
    entity: () => Term,
    updateRule: 'cascade',
    deleteRule: 'cascade'
  })
  term: Term

  @ManyToOne({
    entity: () => Term,
    updateRule: 'cascade',
    deleteRule: 'cascade'
  })
  relatedTerm: Term

  @Enum({ items: () => RelationType })
  type: RelationType
}
