import { Size } from '@/ui/theme'

import { AttachmentProps } from '../../attachment'
import { TermProps } from '../../term'

import { ParagraphType } from './paragraph.constants'

export type { ParagraphType }

export type Item = {
  id: number
  text: string
  order: number
  type: Exclude<ParagraphType, ParagraphType.DEFINITION>
  width: Size
  attachments: AttachmentProps.Collection
}

export type Token = {
  id?: number
  uid: string
  w: string
  l?: string
  r?: string
  f: number
  d?: boolean
  s?: Token[]
  o?: string
}

export type Tokens = (string | Token)[]

export type ItemNext = Pick<Item, 'id' | 'type'>

export type ItemAvailable = Omit<Item, 'text'> & {
  text: Tokens
  visible: boolean
  next?: ItemNext
}

export type Definition = {
  id: string
  type: ParagraphType.DEFINITION
  term?: TermProps.ItemDefinition
  order: number
}

export type Collection = Item[]

export type CollectionAvailable = (ItemAvailable | Definition)[]

export type CreateData = Omit<Item, 'id' | 'attachments'>

export type CreateResponse = {
  data: {
    id: number
  }
}
