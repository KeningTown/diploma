import { LoginData, TokenSet } from './auth.types'

import { request } from '@/api'

export const URL = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refreshTokens'
} as const

export const api = {
  login: (data: LoginData) =>
    request<TokenSet>({
      url: URL.LOGIN,
      method: 'post',
      data
    }),

  logout: () =>
    request({
      url: URL.LOGOUT,
      method: 'get'
    }),

  refresh: () =>
    request<TokenSet>({
      url: URL.REFRESH,
      method: 'get'
    })
}
