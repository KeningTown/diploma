import {
  ListFilter,
  List,
  ItemFull,
  ItemDefinition,
  CreateData
} from './term.types'

import { request } from '@/api'

export const api = {
  create: (data: CreateData) => {
    return request({
      url: '/terms',
      method: 'post',
      data
    })
  },

  read: (id: string | number) => {
    return request<ItemFull>({
      url: `/terms/${id}`,
      method: 'get'
    })
  },

  readDefinition: (id: string | number) => {
    return request<ItemDefinition>({
      url: `/terms/definition/${id}`,
      method: 'get'
    })
  },

  update: (id: number, data: CreateData) => {
    return request({
      url: `/terms/${id}`,
      method: 'patch',
      data
    })
  },

  delete: (id: number) => {
    return request({
      url: `/terms/${id}`,
      method: 'delete'
    })
  },

  list: (params?: ListFilter) => {
    return request<List>({
      url: '/terms',
      method: 'get',
      params
    })
  }
}
