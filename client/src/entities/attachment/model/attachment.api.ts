import {
  Item,
  CreateData,
  UpdateData,
  CreateResponse
} from './attachment.types'

import { request, createFormData } from '@/api'

export const api = {
  create: (paragraphId: number, data: CreateData) =>
    request<CreateResponse>({
      url: `/paragraphs/${paragraphId}/attachments`,
      method: 'post',
      data: createFormData(data)
    }),

  update: (id: number, data: UpdateData) =>
    request<Item>({
      url: `/attachments/${id}`,
      method: 'patch',
      data
    }),

  delete: (id: number) =>
    request({
      url: `/attachments/${id}`,
      method: 'delete'
    }),

  download: (filename: string) =>
    request<Blob>({
      baseURL: '/files',
      url: `/${filename}`,
      method: 'get',
      responseType: 'blob'
    })
}
