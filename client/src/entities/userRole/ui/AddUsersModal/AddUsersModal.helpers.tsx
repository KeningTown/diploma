import React from 'react'
import { Typography } from 'antd'

import { UserProps, user } from '../../../user'

import { Option } from '@/ui'

export const getApiArgs = (name: string) => [{ limit: 1000, name }]

export const usersToOptions = (data: UserProps.List, searchValue: string) =>
  data?.data.map((item: UserProps.Item) => ({
    value: item.id,
    label: user.service.getShortName(item),
    email: item.email,
    searchValue
  }))

export const renderUser = (option: Option & { data: Option }) => (
  <>
    <Typography>{option.label}</Typography>
    <Typography.Text type="secondary">
      {option.value} {option.data.email}
    </Typography.Text>
  </>
)
