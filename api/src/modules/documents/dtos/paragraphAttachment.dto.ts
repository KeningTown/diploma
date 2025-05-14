import { Attachment, AttachmentType } from '../../attachments/attachment.entity'

export class ParagraphAttachmentDto {
  id: number
  filename: string
  type: AttachmentType
  title?: string
  description?: string
  order?: number

  constructor(data: Attachment) {
    this.id = data.id
    this.filename = data.filename
    this.type = data.type
    this.title = data.title
    this.description = data.description
    this.order = data.order
  }
}
