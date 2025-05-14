import { TermProps } from '../../../term'
import { termRelation } from '../../model'

export const MODAL_TITLE = {
  [termRelation.constants.RelationType.EQ_TO]: 'синонимов',
  [termRelation.constants.RelationType.INSTANCE_OF]: 'гиперонимов',
  [termRelation.constants.RelationType.CLASS_OF]: 'гипонимов',
  [termRelation.constants.RelationType.PART_OF]: 'холонимов',
  [termRelation.constants.RelationType.HAS_A]: 'меронимов'
} as const

export const dataDecorator = (data: TermProps.List) => data.data

export const optionsMapper = ({ id, term }: TermProps.Item) => ({
  value: id,
  label: term
})
