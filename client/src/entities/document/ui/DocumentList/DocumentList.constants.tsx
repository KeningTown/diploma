import React from 'react'

import { document } from '../../model'
import { Permission, permission } from '../../../permission'

import { Data, Columns } from './DocumentList.types'

import { ADMIN_DOCUMENT } from '@/routes'

import { ButtonLink } from '@/ui'
import { Value } from '@/components'

export const getColumns = (checkPermissions: Permission.CheckPermissions) => {
  const columns: Columns = [
    {
      dataIndex: 'id',
      title: document.constants.DOCUMENT_FIELD_RU.id,
      render: (id: Data['id']) => <Value copy>{id}</Value>
    },
    {
      dataIndex: 'title',
      title: document.constants.DOCUMENT_FIELD_RU.title
    },
    {
      dataIndex: 'abstract',
      title: document.constants.DOCUMENT_FIELD_RU.abstract,
      render: document.service.getShortAbstract
    }
  ]

  const canReadDocument = checkPermissions({
    [permission.constants.PermissionEntity.DOCUMENT]:
      permission.constants.PermissionAction.READ
  })

  if (canReadDocument) {
    columns.push({
      dataIndex: 'id',
      render: (id: Data['id']) => (
        <ButtonLink to={ADMIN_DOCUMENT} params={{ id }} />
      )
    })
  }

  return columns
}
