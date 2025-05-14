import { TermProps } from '../../term'

import { RelationType } from './termRelation.constants'

export type Type = RelationType

export type Item = {
  id: number
  type: RelationType
  term: TermProps.Item
}

export type Collection = Item[]

export type CreateData = {
  termId: number
  relation: {
    type: RelationType
    termId: number
  }
}[]
