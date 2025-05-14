import { Term } from '../term.entity'

import { TermRelationDto } from '../../termRelation/dtos/termRelation.dto'

export class TermDto {
  id: number
  term: string
  definition?: unknown
  isActive?: boolean
  relations?: TermRelationDto[]
  frequency?: number

  constructor(
    {
      id,
      term,
      definition,
      isActive,
      relations
    }: Partial<Omit<Term, 'definition'> & { definition: unknown }>,
    frequency?: number,
    allRelations = false
  ) {
    this.id = id
    this.term = term
    this.definition = definition
    this.isActive = isActive
    this.relations = relations
      ?.filter(({ relatedTerm }) =>
        allRelations ? true : relatedTerm.isActive
      )
      .map((relation) => new TermRelationDto(relation))
    this.frequency = frequency
  }
}
