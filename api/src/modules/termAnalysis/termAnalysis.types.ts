export type ListQueryParams = {
  limit?: number
  offset?: number
}

export enum AnalysisRelationType {
  HYPERNYMS = 'hypernyms',
  HYPONYMS = 'hyponyms',
  MERONYMS = 'meronyms',
  HOLONYMS = 'holonyms',
  SYNONYMS = 'pos_synonyms'
}

export type AnalyzeResponse = {
  term: string
  frequency: number
  relations?: {
    type: AnalysisRelationType
    terms: string[]
  }[]
}[]
