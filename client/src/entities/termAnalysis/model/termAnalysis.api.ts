import { List } from './termAnalysis.types'

import { request } from '@/api'

export const api = {
  create: () => {
    return request({
      url: '/termAnalyzes',
      method: 'post'
    })
  },

  list: () => {
    return request<List>({
      url: '/termAnalyzes',
      method: 'get'
    })
  }
}
