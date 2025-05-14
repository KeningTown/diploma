import { Collection } from './documentGroup.types'

import { request } from '@/api'

export const api = {
  create: (data: Collection) =>
    request({
      url: '/documentsGroups',
      method: 'post',
      data
    }),

  delete: (id: string | number) =>
    request({
      url: `/documentsGroups/${id}`,
      method: 'delete'
    })
}
