import { DocumentsGroupsDto } from './documentsGroups.dto'

export class DocumentGroupDto {
  id!: number

  name!: string

  constructor(documentsGroups: DocumentsGroupsDto) {
    this.id = documentsGroups.group.id
    this.name = documentsGroups.group.name
  }
}
