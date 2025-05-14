import { WidthType } from '../../common/common.Enums'

import { Paragraph, ParagraphType } from '../../paragraph/paragraph.entity'

import { ParagraphAttachmentDto } from './paragraphAttachment.dto'

export class BlockParagraphDto {
  id: number
  text: string
  type: ParagraphType
  width: WidthType
  order: number
  attachments: ParagraphAttachmentDto[]

  constructor(data: Paragraph) {
    this.id = data.id
    this.text = data.text
    this.type = data.type
    this.width = data.width
    this.order = data.order
    this.attachments = data.attachments.map(
      (attachment) => new ParagraphAttachmentDto(attachment)
    )
  }
}
