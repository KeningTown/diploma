import { WidthType } from '../../common/common.Enums'
import { BlockParagraphDto } from './blockParagraph.dto'
import { Block } from '../../blocks/block.entity'

export class DocumentBlockDto {
  id: number
  title: string
  order: number
  width: WidthType
  paragraphs: BlockParagraphDto[]
  distance: Record<string, Record<string, number>>

  constructor(data: Block, distance: Record<string, Record<string, number>>) {
    this.id = data.id
    this.title = data.title
    this.order = data.order
    this.width = data.width
    this.paragraphs = data.paragraphs.map(
      (paragraph) => new BlockParagraphDto(paragraph)
    )
    this.distance = distance
  }
}
