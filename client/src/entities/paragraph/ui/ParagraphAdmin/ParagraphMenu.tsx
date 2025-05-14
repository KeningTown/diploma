import React, { useMemo, useCallback } from 'react'
import { Dropdown } from 'antd'

import { Permission, permission } from '../../../permission'
import { ParagraphProps, paragraph } from '../../model'

import { useNotification, useRequest } from '@/hooks'

import { Button } from '@/ui'

type Props = {
  item: ParagraphProps.Item
  onSelect: (paragraph: ParagraphProps.Item | null) => void
  onDelete: (paragraphId: number) => void
}

const ParagraphMenu: React.FC<Props> = ({ item, onSelect, onDelete }) => {
  const notify = useNotification()

  const { checkPermissions } = Permission.usePermissionChecker()

  const { request, isLoading } = useRequest(paragraph.api.delete)

  const handleDelete = useCallback(() => {
    request(item.id).then(({ error }) => {
      if (error) {
        return notify('error', 'Не удалось удалить абзац')
      }

      notify('success', 'Абзац удален')
      onDelete(item.id)
    })
  }, [item.id, notify, onDelete, request])

  const menu = useMemo(() => {
    const items = []

    const canUpdateParagraph = checkPermissions({
      [permission.constants.PermissionEntity.PARAGRAPH]:
        permission.constants.PermissionAction.UPDATE
    })

    if (canUpdateParagraph) {
      items.push({
        key: 'edit',
        label: 'Редактировать',
        onClick: () => onSelect(item)
      })
    }

    const canDeleteParagraph = checkPermissions({
      [permission.constants.PermissionEntity.PARAGRAPH]:
        permission.constants.PermissionAction.DELETE
    })

    if (canDeleteParagraph) {
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
    //   label: 'Добавить абзац снизу'
    // },
    // {
    //   key: 'add_up',
    //   label: 'Добавить абзац сверху'
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

export default ParagraphMenu
