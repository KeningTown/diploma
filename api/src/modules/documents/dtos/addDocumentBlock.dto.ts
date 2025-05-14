import { WidthType } from '../../common/common.Enums'

export class AddDocumentBlockDto {
  document: number

  title!: string

  order!: number

  width!: WidthType
}
