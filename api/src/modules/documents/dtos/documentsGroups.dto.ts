import { DocumentGroupDto } from './documentGroup.dto'
import { DocumentsGroups } from '../../documents-groups/documentsGroups.entity'

export class DocumentsGroupsDto {
  id!: number

  group!: DocumentGroupDto

  constructor(usersGroups: DocumentsGroups) {
    this.id = usersGroups.id
    this.group = new DocumentGroupDto(usersGroups)
  }
}
