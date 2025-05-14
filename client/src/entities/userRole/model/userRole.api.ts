import { Collection } from './userRole.types'

import { request } from '@/api'

export const api = {
  create: (data: Collection) =>
    request({
      url: '/rolesUsers',
      method: 'post',
      data
    }),

  delete: (id: string | number) =>
    request({
      url: `/rolesUsers/${id}`,
      method: 'delete'
    })
}
