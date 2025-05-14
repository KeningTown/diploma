import { RelationType } from './termRelation.types'

export const OPPOSITE_RELATION_TYPE = {
  [RelationType.HAS_A]: RelationType.PART_OF,
  [RelationType.PART_OF]: RelationType.HAS_A,
  [RelationType.CLASS_OF]: RelationType.INSTANCE_OF,
  [RelationType.INSTANCE_OF]: RelationType.CLASS_OF,
  [RelationType.EQ_TO]: RelationType.EQ_TO
} as const
