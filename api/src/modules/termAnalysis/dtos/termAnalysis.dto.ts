import { TermAnalysis } from '../termAnalysis.entity'

import { TermDto } from '../../term/dtos/term.dto'

export class TermAnalysisDto {
  id: number
  isFinished: boolean
  terms: TermDto[]
  createdAt: Date

  constructor({ id, finished, terms, createdAt }: TermAnalysis) {
    this.id = id
    this.isFinished = finished
    this.terms = terms.map(
      (item) => new TermDto(item.term, item.frequency, true)
    )
    this.createdAt = createdAt
  }
}
