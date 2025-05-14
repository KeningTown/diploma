import { Permission } from '../permission.entity'

export class PermissionDto {
  id!: number

  action!: string

  entity!: string

  constructor(permission: Permission) {
    this.id = permission.id
    this.action = permission.action
    this.entity = permission.entity
  }
}
