import { RolesType } from '../role.entity'

export type RoleItem = {
  name: string
  type?: RolesType
  createdBy?: number
}
