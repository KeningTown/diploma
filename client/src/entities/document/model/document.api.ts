import {
  Item,
  List,
  ListFilter,
  CreateData,
  DocumentGroupList
} from './document.types'

import { request } from '@/api'

export const api = {
  create: (data: CreateData) =>
    request<Item>({
      url: '/documents',
      method: 'post',
      data
    }),

  read: (id: number | string) =>
    request<Item>({
      url: `/documents/${id}`,
      method: 'get'
    }),

  readAvailable: (id: number | string) =>
    request<Item>({
      url: `/documents/available/${id}`,
      method: 'get'
    }),

  update: (id: number, data: CreateData) =>
    request<Item>({
      url: `/documents/${id}`,
      method: 'patch',
      data
    }),

  delete: (id: number) =>
    request({
      url: `/documents/${id}`,
      method: 'delete'
    }),

  list: (params?: ListFilter) =>
    request<List>({
      url: '/documents',
      method: 'get',
      params
    }),

  listAvailable: (params?: ListFilter) =>
    request<List>({
      url: '/documents/available',
      method: 'get',
      params
    }),

  listGroups: (id: number | string) =>
    request<DocumentGroupList>({
      url: `/documents/${id}/groups`,
      method: 'get',
      params: { limit: 1000 }
    })
}
