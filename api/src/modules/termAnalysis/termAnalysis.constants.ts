import { RelationType } from '../termRelation/termRelation.types'
import { AnalysisRelationType } from './termAnalysis.types'

export const RELATION_TYPE_MAP = {
  [AnalysisRelationType.HYPERNYMS]: RelationType.INSTANCE_OF,
  [AnalysisRelationType.HYPONYMS]: RelationType.CLASS_OF,
  [AnalysisRelationType.MERONYMS]: RelationType.HAS_A,
  [AnalysisRelationType.HOLONYMS]: RelationType.PART_OF,
  [AnalysisRelationType.SYNONYMS]: RelationType.EQ_TO
} as const
