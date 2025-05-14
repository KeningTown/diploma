import React, { useCallback } from 'react'

import { UserProps } from '../../../user'
import { userGroup } from '../../model'

import { ADMIN_GROUP } from '@/routes'

import { router } from '@/services'

import { useNotification, useRequest } from '@/hooks'

import { Tag } from '@/ui'
import { Value } from '@/components'

type Props = UserProps.UserGroup & {
  noLink?: boolean
  onRemove?: false | (() => void)
}

const GroupTag: React.FC<Props> = ({ id, group, noLink, onRemove }) => {
  const notify = useNotification()

  const { request, isLoading } = useRequest(userGroup.api.delete)

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
          <>Не удалось удалить группу {name} для пользователя</>
        )
      }

      notify('success', <>Для пользователя удалена группа {name}</>)
      onRemove && onRemove()
    })
  }, [id, notify, onRemove, request, group.name])

  return (
    <Tag
      color="purple"
      to={!noLink && router.buildPath(ADMIN_GROUP, { id: group.id })}
      isClosing={isLoading}
      onClose={onRemove ? handleRemove : undefined}
    >
      {group.name}
    </Tag>
  )
}

export default GroupTag
