import { ResponseList } from '@/api'

import { PermissionEntity, PermissionAction } from './permission.constants'

export type { PermissionEntity, PermissionAction }

export type Item = {
  id: number
  entity: PermissionEntity
  action: PermissionAction
}

export type List = ResponseList<Item>

export type Collection = Item[]
