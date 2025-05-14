import React, { useCallback } from 'react'

import { documentGroup } from '../../model'
import { DocumentProps } from '../../../document'

import { ADMIN_GROUP } from '@/routes'

import { router } from '@/services'

import { useNotification, useRequest } from '@/hooks'

import { Value } from '@/components'
import { Tag } from '@/ui'

type Props = DocumentProps.DocumentGroup & {
  onRemove?: false | (() => void)
}

const GroupTag: React.FC<Props> = ({ id, group, onRemove }) => {
  const notify = useNotification()

  const { request, isLoading } = useRequest(documentGroup.api.delete)

  const handleRemove = useCallback(() => {
    request(id).then(({ error }) => {
      const name = (
        <Value inline bold>
          {group.name}
        </Value>
      )

      if (error) {
        return notify(
          'error',
          <>Не удалось удалить группу {name} для документа</>
        )
      }

      notify('success', <>Для документа удалена группа {name}</>)
      onRemove && onRemove()
    })
  }, [id, notify, onRemove, request, group.name])

  return (
    <Tag
      color="purple"
      to={router.buildPath(ADMIN_GROUP, { id: group.id })}
      isClosing={isLoading}
      onClose={onRemove ? handleRemove : undefined}
    >
      {group.name}
    </Tag>
  )
}

export default GroupTag
