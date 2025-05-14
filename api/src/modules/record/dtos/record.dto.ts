import { Record } from '../record.entity'

import { UserDto } from '../../users/dtos/user.dto'
import { DocumentDto } from '../../documents/dtos/document.dto'

export class RecordDto {
  id: number
  user: UserDto
  document: DocumentDto
  createdAt: Date
  data?: unknown

  constructor({ id, user, document, createdAt }: Record, data?: unknown) {
    this.id = id
    this.user = new UserDto(user)
    this.document = new DocumentDto(document)
    this.createdAt = createdAt
    this.data = data
  }
}
