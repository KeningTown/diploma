import React from 'react'
import { Tooltip } from 'antd'

import { Permission, permission } from '../../../permission'

import { Button } from '@/ui'

type Props = {
  onAdd: () => void
}

const ParagraphAdd: React.FC<Props> = ({ onAdd }) => {
  return (
    <Permission.PermissionChecker
      permissions={{
        [permission.constants.PermissionEntity.PARAGRAPH]:
          permission.constants.PermissionAction.CREATE
      }}
    >
      <Tooltip title="Добавить абзац" placement="right">
        <Button icon="plus" type="text" size="small" onClick={onAdd} />
      </Tooltip>
    </Permission.PermissionChecker>
  )
}

export default ParagraphAdd
