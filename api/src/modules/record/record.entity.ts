import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../common/base.entity'
import { User } from '../users/user.entity'
import { Document } from '../documents/document.entity'

@Entity({ tableName: 'records' })
export class Record extends BaseEntity {
  @ManyToOne({
    entity: () => User,
    updateRule: 'cascade',
    deleteRule: 'cascade'
  })
  user: User

  @ManyToOne({
    entity: () => Document,
    updateRule: 'cascade',
    deleteRule: 'cascade'
  })
  document: Document

  @Property()
  filename: string
}
