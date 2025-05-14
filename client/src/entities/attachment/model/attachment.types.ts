import { AttachmentType } from './attachment.constants'

export type Item = {
  id: number
  filename: string
  type: AttachmentType
  title?: string
  description?: string
  order: number
}

export type Collection = Item[]

export type CreateData = Omit<Item, 'id'> & { file: File }
export type UpdateData = Omit<Item, 'id'>

export type CreateResponse = {
  data: {
    id: number
    filename: string
  }
}
