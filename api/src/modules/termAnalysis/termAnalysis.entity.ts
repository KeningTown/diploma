import { Entity, Property, OneToMany, Collection } from '@mikro-orm/core'

import { BaseEntity } from '../common/base.entity'
import { TermAnalysisTerm } from '../termAnalysisTerm/termAnalysisTerm.entity'

@Entity({ tableName: 'term_analyzes' })
export class TermAnalysis extends BaseEntity {
  @Property({ type: 'boolean' })
  finished: boolean

  @OneToMany(() => TermAnalysisTerm, 'termAnalysis')
  terms = new Collection<TermAnalysisTerm>(this)
}
