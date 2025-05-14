import { Item, List, GroupUserList, CreateData } from './group.types'

import { request } from '@/api'

export const api = {
  create: (data: CreateData) =>
    request<Item>({
      url: '/groups',
      method: 'post',
      data
    }),

  read: (id: string | number) =>
    request<Item>({
      url: `/groups/${id}`,
      method: 'get'
    }),

  update: (id: number, data: CreateData) =>
    request<Item>({
      url: `/groups/${id}`,
      method: 'patch',
      data
    }),

  delete: (id: number) =>
    request({
      url: `/groups/${id}`,
      method: 'delete'
    }),

  list: () =>
    request<List>({
      url: '/groups',
      method: 'get',
      params: { limit: 1000 }
    }),

  listUsers: (id: string | number) =>
    request<GroupUserList>({
      url: `/groups/${id}/users`,
      method: 'get',
      params: { limit: 1000 }
    })
}
