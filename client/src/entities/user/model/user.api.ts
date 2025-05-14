import {
  Item,
  List,
  ListFilter,
  UserRoleList,
  UserGroupList,
  CreateData,
  CreateResponse,
  UpdatePasswordResponse
} from './user.types'

import { request } from '@/api'

const url = '/users'

export const api = {
  create: (data: CreateData) =>
    request<CreateResponse>({
      url,
      method: 'post',
      data
    }),

  read: (id: string | number) =>
    request<Item>({
      url: `${url}/${id}`,
      method: 'get'
    }),

  update: (id: number, data: CreateData) =>
    request({
      url: `${url}/${id}`,
      method: 'patch',
      data
    }),

  updatePassword: (id: number) =>
    request<UpdatePasswordResponse>({
      url: `${url}/${id}/changePassword`,
      method: 'patch'
    }),

  list: (params?: ListFilter) =>
    request<List>({
      url,
      method: 'get',
      params
    }),

  listRoles: (id: number) =>
    request<UserRoleList>({
      url: `${url}/${id}/roles`,
      method: 'get',
      params: { limit: 1000 }
    }),

  listGroups: (id: number) =>
    request<UserGroupList>({
      url: `${url}/${id}/groups`,
      method: 'get',
      params: { limit: 1000 }
    })
}
