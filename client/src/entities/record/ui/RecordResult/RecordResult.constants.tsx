import React from 'react'
import { Tag } from 'antd'

import { permission, PermissionProps } from '../../../permission'

export const renderEntity = (entity: PermissionProps.PermissionEntity) => {
  return (
    <Tag bordered={false}>
      {permission.constants.PERMISSION_ENTITY_RU[entity]}
    </Tag>
  )
}

const getColor = (value: number) => {
  if (value < 0.25) {
    return 'red'
  }

  if (value < 0.5) {
    return 'orange'
  }

  if (value < 0.75) {
    return 'gold'
  }

  return 'green'
}

export const renderValue = (value?: number) => {
  if (value === undefined) {
    return null
  }

  const color = getColor(value)

  return (
    <Tag bordered={false} color={color}>
      {(value * 100).toFixed(2)} %
    </Tag>
  )
}
