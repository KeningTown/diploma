import { Group } from '../group.entity'

export class GroupDto {
  id!: number

  name!: string

  constructor(group: Group) {
    this.id = group.id
    this.name = group.name
  }
}
