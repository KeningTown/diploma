import { TermRelationProps } from '../../../../termRelation'

export type Point = {
  x: number
  y: number
}

export type Node = Partial<Point> & {
  id: number
  label: string
  color?: string
  w?: number
  h?: number
}

export type Link = {
  source: number | Node
  target: number | Node
  type: TermRelationProps.Type
}
