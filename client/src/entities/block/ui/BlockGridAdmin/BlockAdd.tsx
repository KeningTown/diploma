import React from 'react'
import { Col, Tooltip } from 'antd'

import { Permission, permission } from '../../../permission'

import { Button } from '@/ui'

type Props = {
  onAdd: () => void
}

const BlockAdd: React.FC<Props> = ({ onAdd }) => {
  return (
    <Permission.PermissionChecker
      permissions={{
        [permission.constants.PermissionEntity.BLOCK]:
          permission.constants.PermissionAction.CREATE
      }}
    >
      <Col xs={24}>
        <Tooltip title="Добавить блок" placement="right">
          <Button icon="plus" type="text" size="small" onClick={onAdd} />
        </Tooltip>
      </Col>
    </Permission.PermissionChecker>
  )
}

export default BlockAdd
