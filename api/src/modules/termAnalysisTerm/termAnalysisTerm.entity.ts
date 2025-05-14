import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../common/base.entity'
import { TermAnalysis } from '../termAnalysis/termAnalysis.entity'
import { Term } from '../term/term.entity'
import { Document } from '../documents/document.entity'

@Entity({ tableName: 'term_analyzes_terms' })
export class TermAnalysisTerm extends BaseEntity {
  @ManyToOne({
    entity: () => TermAnalysis,
    updateRule: 'cascade',
    deleteRule: 'cascade'
  })
  termAnalysis: TermAnalysis

  @ManyToOne({
    entity: () => Term,
    updateRule: 'cascade',
    deleteRule: 'cascade'
  })
  term: Term

  @ManyToOne({
    entity: () => Document,
    updateRule: 'cascade',
    deleteRule: 'cascade'
  })
  document: Document

  @Property({ type: 'float' })
  frequency: number
}
