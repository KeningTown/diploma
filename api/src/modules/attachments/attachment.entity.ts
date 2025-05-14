import { Entity, Enum, ManyToOne, Opt, Property } from '@mikro-orm/core'

import { BaseEntity } from '../common/base.entity'
import { Paragraph } from '../paragraph/paragraph.entity'

export enum AttachmentType {
  IMAGE = 'image',
  FILE = 'file'
}

@Entity({ tableName: 'paragraph_attachments' })
export class Attachment extends BaseEntity {
  @Property({ length: 255 })
  filename!: string

  @Enum({ items: () => AttachmentType })
  type: AttachmentType & Opt = AttachmentType.IMAGE

  @Property({ length: 255, nullable: true })
  title?: string

  @Property({ type: 'text', nullable: true })
  description?: string

  @Property()
  order: number

  @ManyToOne({
    entity: () => Paragraph,
    updateRule: 'cascade',
    deleteRule: 'cascade'
  })
  paragraph!: Paragraph

  @Property({ nullable: true })
  deletedBy?: number

  @Property({ nullable: true })
  deletedAt?: Date
}
