import { Entity, ManyToOne } from '@mikro-orm/core'

import { BaseEntity } from '../common/base.entity'
import { Group } from '../groups/group.entity'
import { Document } from '../documents/document.entity'

@Entity({ tableName: 'documents_groups' })
export class DocumentsGroups extends BaseEntity {
  @ManyToOne({
    entity: () => Group,
    deleteRule: 'cascade'
  })
  group!: Group

  @ManyToOne({
    entity: () => Document,
    deleteRule: 'cascade'
  })
  document!: Document
}
