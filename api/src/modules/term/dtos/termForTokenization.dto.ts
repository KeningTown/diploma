import { Term } from '../term.entity'
import { RelationType } from '../../termRelation/termRelation.types'

export class TermForTokenizationDto {
  id: number
  term: string
  hasDefinition: boolean
  synonyms?: TermForTokenizationDto[]
  frequency?: number

  constructor(
    { id, term, definition, relations, analyzes }: Term,
    documentId?: number
  ) {
    this.id = id
    this.term = term
    this.hasDefinition = Boolean(definition)
    this.synonyms = relations?.reduce<TermForTokenizationDto[]>(
      (synonyms, { relatedTerm, type }) => {
        if (relatedTerm.isActive && type === RelationType.EQ_TO) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
          const { relations, ...rest } = relatedTerm

          synonyms.push(new TermForTokenizationDto(rest as Term, documentId))
        }

        return synonyms
      },
      []
    )

    const documentAnalyzes = analyzes.filter(
      ({ document }) => document.id === documentId
    )

    const frequencies = documentAnalyzes.length
      ? documentAnalyzes.map(({ frequency }) => frequency)
      : analyzes.map(({ frequency }) => frequency)

    if (frequencies.length) {
      this.frequency = Math.max(...frequencies)
    }
  }
}
