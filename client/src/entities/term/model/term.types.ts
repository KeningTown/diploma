import { TermRelationProps } from '../../termRelation'
import { ParagraphProps } from '../../paragraph'

import { ResponseList, Pagination } from '@/api'

export type Item = {
  id: number
  term: string
  definition?: string
  isActive?: boolean
}

export type ItemFull = Item & {
  relations: TermRelationProps.Collection
  frequency?: number
}

export type ItemDefinition = Omit<ItemFull, 'definition'> & {
  definition: ParagraphProps.Tokens
}

export type List = ResponseList<ItemFull>

export type ListFilter = Pagination

export type CreateData = Omit<Item, 'id'>
