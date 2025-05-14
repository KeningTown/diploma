import { List } from './permission.types'

import { request } from '@/api'

export const api = {
  list: () =>
    request<List>({
      url: '/permissions',
      method: 'get'
    })
}
