import a, { AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'

export const axios = a.create({
  baseURL: '/api',
  paramsSerializer: (params) =>
    qs.stringify(params, {
      encode: false,
      filter: (_, value) =>
        typeof value === 'boolean' ? value : value || undefined
    })
})

export const request = <D>(config: AxiosRequestConfig) => {
  return axios.request<D>(config)
}

export const fakeRequest = <D>(_: AxiosRequestConfig, data?: D) => {
  return new Promise<AxiosResponse<D>>((resolve, reject) => {
    setTimeout(() => {
      if (data) {
        resolve({ data } as AxiosResponse<D>)
        return
      }

      reject(new Error())
    }, 300)
  })
}

export const createFormData = <T extends Record<string, unknown>>(data: T) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (!value) {
      return
    }

    formData.append(key, value instanceof Blob ? value : String(value))
  })

  return formData
}
