import { ResponseList, Pagination } from '@/api'

import { RoleProps } from '../../role'
import { GroupProps } from '../../group'

export type Item = {
  id: number
  lastName: string
  firstName: string
  middleName?: string
  email: string
  active: boolean
}

export type UserRole = {
  id: number
  role: RoleProps.Item
}

export type UserRoleCollection = UserRole[]

export type UserRoleList = ResponseList<UserRole>

export type UserGroup = {
  id: number
  group: GroupProps.Item
}

export type UserGroupCollection = UserGroup[]

export type UserGroupList = ResponseList<UserGroup>

export type ItemFull = Item &
  Partial<{
    roles: UserRoleCollection
    groups: UserGroupCollection
  }>

export type List = ResponseList<ItemFull>

export type ListFilter = Pagination &
  Partial<{
    userIds: number[]
    name: string
    active: boolean
  }>

export type CreateData = Omit<Item, 'id' | 'password'>

export type CreateResponse = {
  data: {
    id: number
    password: string
    createdAt: string
  }
}

export type CreateError = {
  message: string
}

export type UpdatePasswordResponse = {
  data: {
    password: string
  }
}
