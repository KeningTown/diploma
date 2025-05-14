import { BlockProps } from '../../block'
import { UserProps } from '../../user'
import { DocumentProps } from '../../document'

import { ResponseList, Pagination } from '@/api'

type ResultParagraph = {
  read: number
  understood: number
  words: Record<string, number>
}
type ResultBlock = Record<string, ResultParagraph>
export type Result = Record<string, ResultBlock>

export type Gazes = [number, number, number][]

export type Synonyms = Record<number, number>

export type Data = {
  width: number
  blocks: BlockProps.ItemAvailable[]
  result: Result
  gazes: Gazes
  synonyms: Record<number, number>
}

export type Item = {
  id: number
  user: UserProps.Item
  document: DocumentProps.Item
  createdAt: string
}

export type ItemFull = Item & {
  data: Data
}

export type List = ResponseList<Item>

export type ListFilter = Pagination &
  Partial<{
    userId: number
  }>

export type CreateData = {
  documentId: number
  file: File
}
