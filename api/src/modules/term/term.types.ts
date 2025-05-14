import { Term } from './term.entity'

export type ListQueryParams = {
  limit?: number
  offset?: number
}

export type CreateData = Pick<Term, 'term' | 'definition' | 'isActive'>
