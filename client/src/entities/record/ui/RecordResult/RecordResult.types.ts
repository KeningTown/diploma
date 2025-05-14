import { PermissionProps } from '../../../permission'

export type DataItem = {
  key: number | string
  entity: PermissionProps.PermissionEntity
  title?: string
  read: number
  understood: number
  total: number
  items?: DataItem[]
}
