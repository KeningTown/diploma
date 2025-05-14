import { ItemFull, List, CreateData, ListFilter } from './record.types'

import { request, createFormData } from '@/api'

export const api = {
  create: (data: CreateData) => {
    return request({
      url: '/records',
      method: 'post',
      data: createFormData(data)
    })
  },

  read: (id: number) => {
    return request<ItemFull>({
      url: `/records/${id}`,
      method: 'get'
    })
  },

  list: (params?: ListFilter) => {
    return request<List>({
      url: '/records',
      method: 'get',
      params
    })
  }
}
