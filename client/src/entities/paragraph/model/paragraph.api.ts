import { Item, CreateData, CreateResponse } from './paragraph.types'

import { request } from '@/api'

export const api = {
  create: (blockId: number, data: CreateData) =>
    request<CreateResponse>({
      url: `/blocks/${blockId}/paragraphs`,
      method: 'post',
      data
    }),

  update: (id: number, data: CreateData) =>
    request<Item>({
      url: `/paragraphs/${id}`,
      method: 'patch',
      data
    }),

  delete: (id: number) =>
    request({
      url: `/paragraphs/${id}`,
      method: 'delete'
    })
}
