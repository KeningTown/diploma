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
import { Document } from '../documents/document.entity'
import { WidthType } from '../common/common.Enums'
import { Paragraph } from '../paragraph/paragraph.entity'

@Entity({ tableName: 'blocks' })
export class Block extends BaseEntity {
  @Property({ length: 255 })
  title!: string

  @Enum({ items: () => WidthType })
  width: WidthType & Opt = WidthType.XL

  @Property()
  order!: number

  @ManyToOne({
    entity: () => Document,
    updateRule: 'cascade',
    deleteRule: 'cascade'
  })
  document!: Document

  @OneToMany('Paragraph', 'block')
  paragraphs = new Collection<Paragraph>(this)

  @Property({ nullable: true })
  deletedBy?: number

  @Property({ nullable: true })
  deletedAt?: Date
}
