import { ResponseList, Pagination } from '@/api'

import { GroupProps } from '../../group'

export type Item = {
  id: number
  title: string
  abstract: string
}

export type List = ResponseList<Item>

export type ListFilter = Pagination

export type CreateData = Omit<Item, 'id'>

export type DocumentGroup = {
  id: number
  group: GroupProps.Item
}

export type DocumentGroupList = ResponseList<DocumentGroup>
