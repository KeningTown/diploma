import { CreateData } from './termRelation.types'

import { request } from '@/api'

export const api = {
  create: (data: CreateData) => {
    return request({
      url: '/termsRelations',
      method: 'post',
      data
    })
  },

  delete: (id: number) => {
    return request({
      url: `/termsRelations/${id}`,
      method: 'delete'
    })
  }
}
