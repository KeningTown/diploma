import { AttachmentType } from './attachment.entity'

export type AttachmentData = {
  paragraph: number
  filename: string
  type: AttachmentType
  title?: string
  description?: string
  order?: number
}
