import { Item, List, CreateData, RoleUserList } from './role.types'

import { request } from '@/api'

const url = '/roles'

export const api = {
  create: (data: CreateData) =>
    request<Item>({
      url,
      method: 'post',
      data
    }),

  read: (id: string | number) =>
    request<Item>({
      url: `${url}/${id}`,
      method: 'get'
    }),

  update: (id: number, data: CreateData) =>
    request<Item>({
      url: `${url}/${id}`,
      method: 'patch',
      data
    }),

  delete: (id: number) =>
    request({
      url: `${url}/${id}`,
      method: 'delete'
    }),

  list: () =>
    request<List>({
      url,
      method: 'get',
      params: { limit: 1000 }
    }),

  listUsers: (id: number) =>
    request<RoleUserList>({
      url: `${url}/${id}/users`,
      method: 'get',
      params: { limit: 1000 }
    })
}
