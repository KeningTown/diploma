import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Opt,
  Property
} from '@mikro-orm/core'

import { BaseEntity } from '../common/base.entity'
import { Block } from '../blocks/block.entity'
import { Attachment } from '../attachments/attachment.entity'
import { WidthType } from '../common/common.Enums'

export enum ParagraphType {
  BASIC = 'basic',
  ADDITIONAL = 'additional',
  REVEALING = 'revealing'
}

@Entity({ tableName: 'paragraphs' })
export class Paragraph extends BaseEntity {
  @Property({ type: 'text' })
  text!: string

  @Enum({ items: () => ParagraphType })
  type: ParagraphType & Opt = ParagraphType.BASIC

  @Enum({ items: () => WidthType })
  width: WidthType & Opt = WidthType.XL

  @Property()
  order!: number

  @ManyToOne({
    entity: () => Block,
    updateRule: 'cascade',
    deleteRule: 'cascade'
  })
  block!: Block

  @OneToMany('Attachment', 'paragraph')
  attachments = new Collection<Attachment>(this)

  @Property({ nullable: true })
  deletedBy?: number

  @Property({ nullable: true })
  deletedAt?: Date
}
