import { TermProps } from '../../term'

import { ResponseList } from '@/api'

export type Item = {
  id: number
  isFinished: boolean
  terms: TermProps.ItemFull[]
  createdAt: string
}

export type List = ResponseList<Item>
