import React, { useMemo, useCallback } from 'react'

import { userGroup } from '../../model'
import { user } from '../../../user'
import { GroupProps } from '../../../group'

import { ADMIN_USER } from '@/routes'

import { router } from '@/services'

import { useNotification, useRequest } from '@/hooks'

import { Tag } from '@/ui'
import { Value } from '@/components'

type Props = GroupProps.GroupUser & {
  onRemove?: false | (() => void)
}

const UserTag: React.FC<Props> = ({ id, user: item, onRemove }) => {
  const notify = useNotification()

  const { request, isLoading } = useRequest(userGroup.api.delete)

  const name = useMemo(() => user.service.getShortName(item), [item])

  const handleRemove = useCallback(() => {
    request(id).then(({ error }) => {
      const user = (
        <Value inline bold>
          {name}
        </Value>
      )

      if (error) {
        return notify(
          'error',
          <>Не удалось удалить группу для пользователя {user}</>
        )
      }

      notify('success', <>Для пользователя {user} удалена группа</>)
      onRemove && onRemove()
    })
  }, [id, name, notify, onRemove, request])

  return (
    <Tag
      to={router.buildPath(ADMIN_USER, { id: item.id })}
      isClosing={isLoading}
      onClose={onRemove ? handleRemove : undefined}
    >
      {name}
    </Tag>
  )
}

export default UserTag
