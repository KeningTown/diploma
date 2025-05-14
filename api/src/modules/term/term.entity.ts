import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core'

import { BaseEntity } from '../common/base.entity'
import { TermRelation } from '../termRelation/termRelation.entity'
import { TermAnalysisTerm } from '../termAnalysisTerm/termAnalysisTerm.entity'

@Entity({ tableName: 'terms' })
export class Term extends BaseEntity {
  @Property()
  term: string

  @Property({ type: 'text', nullable: true })
  definition?: string

  @Property()
  isActive = true

  @OneToMany(() => TermRelation, 'term')
  relations = new Collection<TermRelation>(this)

  @OneToMany(() => TermAnalysisTerm, 'term')
  analyzes = new Collection<TermAnalysisTerm>(this)

  @Property({ nullable: true })
  deletedBy?: number

  @Property({ nullable: true })
  deletedAt?: Date
}
