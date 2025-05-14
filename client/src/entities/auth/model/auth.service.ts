import { jwtDecode } from 'jwt-decode'
import a, {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosRequestConfig
} from 'axios'

import { UserProps } from '../../user'

import { TokenSet } from './auth.types'

import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  STORAGE_UPDATE_EVENT
} from './auth.constants'

import { URL, api } from './auth.api'

import { axios } from '@/api'

const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const getUserFromAccessToken = () => {
  const accessToken = getAccessToken()

  if (!accessToken) {
    return null
  }

  const { user } = jwtDecode<{ user: UserProps.ItemFull }>(accessToken)

  return user
}

export const handleLogin = ({ accessToken, refreshToken }: TokenSet) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  window.dispatchEvent(new Event(STORAGE_UPDATE_EVENT))
}

const handleLogout = () => {
  // TODO: fix requests after logout
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  window.dispatchEvent(new Event(STORAGE_UPDATE_EVENT))
}

const handleRequest = (config: InternalAxiosRequestConfig) => {
  const token =
    config.url === URL.REFRESH ? getRefreshToken() : getAccessToken()

  if (config.url === URL.LOGOUT) {
    handleLogout()
  }

  return {
    ...config,
    headers: new a.AxiosHeaders({
      ...config.headers,
      Authorization: `Bearer ${token}`
    })
  }
}

const handleError = async (error: AxiosError) => {
  const isAuthRequest = Object.values(URL).some(
    (url) => error.response?.config?.url === url
  )

  if (isAuthRequest || error.response?.status !== 401) {
    return Promise.reject(error)
  }

  try {
    const { data } = await api.refresh()

    handleLogin(data)
  } catch (error) {
    api.logout()

    return Promise.reject(error)
  }

  return axios.request(error.config as AxiosRequestConfig)
}

axios.interceptors.request.use(handleRequest)
axios.interceptors.response.use(undefined, handleError)
