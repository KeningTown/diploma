import { ResponseList } from '@/api'

import { PermissionProps } from '../../permission'
import { UserProps } from '../../user'

import { RoleType } from './role.constants'

export type Item = {
  id: number
  type: RoleType
  name: string
  permissions?: PermissionProps.Collection
}

export type List = ResponseList<Item>

export type RoleUser = {
  id: number
  user: UserProps.Item
}

export type RoleUserList = ResponseList<RoleUser>

export type CreateData = {
  name: string
  type: RoleType
}
