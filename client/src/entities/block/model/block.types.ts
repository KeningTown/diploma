import { ResponseList } from '@/api'

import { Size } from '@/ui/theme'

import { ParagraphProps } from '../../paragraph'

export type DistanceItem = Record<string, number>

export type Distance = Record<string, DistanceItem>

export type Item = {
  id: number
  title: string
  order: number
  width: Size
  paragraphs: ParagraphProps.Collection
  distance?: Distance
}

export type ItemAvailable = Omit<Item, 'paragraphs'> & {
  paragraphs: ParagraphProps.CollectionAvailable
}

export type List = ResponseList<Item>

export type ListAvailable = ResponseList<ItemAvailable>

export type CreateData = Omit<Item, 'id' | 'paragraphs'>

export type CreateResponse = {
  data: {
    id: number
  }
}
