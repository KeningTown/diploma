import { ParagraphType } from './paragraph.entity'

import { WidthType } from '../common/common.Enums'

export type ParagraphData = {
  block: number
  text: string
  type: ParagraphType
  width: WidthType
  order: number
}
