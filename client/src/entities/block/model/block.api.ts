import {
  Item,
  List,
  CreateData,
  CreateResponse,
  ListAvailable
} from './block.types'

import { request } from '@/api'

export const api = {
  create: (documentId: number, data: CreateData) =>
    request<CreateResponse>({
      url: `/documents/${documentId}/blocks`,
      method: 'post',
      data
    }),

  update: (id: number, data: CreateData) =>
    request<Item>({
      url: `/blocks/${id}`,
      method: 'patch',
      data
    }),

  delete: (id: number) =>
    request({
      url: `/blocks/${id}`,
      method: 'delete'
    }),

  list: (documentId: number | string) =>
    request<List>({
      url: `/documents/${documentId}/blocks`,
      method: 'get',
      params: { limit: 1000 }
    }),

  listAvailable: (documentId: number | string) =>
    request<ListAvailable>({
      url: `/documents/available/${documentId}/blocks`,
      method: 'get',
      params: { limit: 1000 }
    })
}
