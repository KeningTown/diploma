import { ResponseList } from '@/api'

import { UserProps } from '../../user'

export type Item = {
  id: number
  name: string
}

export type List = ResponseList<Item>

export type GroupUser = {
  id: number
  user: UserProps.Item
}

export type GroupUserList = ResponseList<GroupUser>

export type CreateData = {
  name: string
}
