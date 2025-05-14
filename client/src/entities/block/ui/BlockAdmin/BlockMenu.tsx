import React, { useMemo, useCallback } from 'react'
import { Dropdown } from 'antd'

import { BlockProps, block } from '../../model'
import { Permission, permission } from '../../../permission'

import { useNotification, useRequest } from '@/hooks'

import { Button } from '@/ui'

type Props = {
  item: BlockProps.Item
  onSelect: (block: BlockProps.Item | null) => void
  onDelete: (blockId: number) => void
}

const BlockMenu: React.FC<Props> = ({ item, onSelect, onDelete }) => {
  const notify = useNotification()

  const { checkPermissions } = Permission.usePermissionChecker()

  const { request, isLoading } = useRequest(block.api.delete)

  const handleDelete = useCallback(() => {
    request(item.id).then(({ error }) => {
      if (error) {
        return notify('error', 'Не удалось удалить блок')
      }

      notify('success', 'Блок удален')
      onDelete(item.id)
    })
  }, [item.id, notify, onDelete, request])

  const menu = useMemo(() => {
    const items = []

    const canUpdateBlock = checkPermissions({
      [permission.constants.PermissionEntity.BLOCK]:
        permission.constants.PermissionAction.UPDATE
    })

    if (canUpdateBlock) {
      items.push({
        key: 'edit',
        label: 'Редактировать',
        onClick: () => onSelect(item)
      })
    }

    const canDeleteBlock = checkPermissions({
      [permission.constants.PermissionEntity.BLOCK]:
        permission.constants.PermissionAction.DELETE
    })

    if (canDeleteBlock) {
      items.push({
        key: 'delete',
        label: 'Удалить',
        danger: true,
        disabled: isLoading,
        onClick: handleDelete
      })
    }

    // {
    //   key: 'divider_1',
    //   type: 'divider'
    // },
    // {
    //   key: 'move_down',
    //   label: 'Переместить вниз'
    // },
    // {
    //   key: 'move_up',
    //   label: 'Переместить вверх'
    // },
    // {
    //   key: 'divider_2',
    //   type: 'divider'
    // },
    // {
    //   key: 'add_down',
    //   label: 'Добавить блок снизу'
    // },
    // {
    //   key: 'add_up',
    //   label: 'Добавить блок сверху'
    // }

    return { items }
  }, [checkPermissions, handleDelete, isLoading, item, onSelect])

  if (!menu.items.length) {
    return null
  }

  return (
    <Dropdown trigger={['click']} placement="bottomRight" menu={menu}>
      <Button icon="setting" type="text" size="small" />
    </Dropdown>
  )
}

export default BlockMenu
