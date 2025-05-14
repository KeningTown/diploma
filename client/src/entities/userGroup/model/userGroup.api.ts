import { request } from '@/api'

import { Collection } from './userGroup.types'

export const api = {
  create: (data: Collection) =>
    request({
      url: '/groupsUsers',
      method: 'post',
      data
    }),

  delete: (id: string | number) =>
    request({
      url: `/groupsUsers/${id}`,
      method: 'delete'
    })
}
