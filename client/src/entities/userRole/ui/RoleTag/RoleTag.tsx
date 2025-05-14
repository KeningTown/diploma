import React, { useCallback } from 'react'

import { userRole } from '../../model'
import { UserProps } from '../../../user'

import { ADMIN_ROLES } from '@/routes'

import { useNotification, useRequest } from '@/hooks'

import { Value } from '@/components'
import { Tag } from '@/ui'

type Props = UserProps.UserRole & {
  noLink?: boolean
  onRemove?: false | (() => void)
}

const RoleTag: React.FC<Props> = ({ id, role, noLink, onRemove }) => {
  const notify = useNotification()

  const { request, isLoading } = useRequest(userRole.api.delete)

  const handleRemove = useCallback(() => {
    request(id).then(({ error }) => {
      const name = (
        <Value inline bold>
          {role.name}
        </Value>
      )

      if (error) {
        return notify(
          'error',
          <>Не удалось удалить роль {name} для пользователя</>
        )
      }

      notify('success', <>Для пользователя удалена роль {name}</>)
      onRemove && onRemove()
    })
  }, [id, notify, onRemove, request, role.name])

  return (
    <Tag
      color="blue"
      to={!noLink && `${ADMIN_ROLES}/${role.id}`}
      isClosing={isLoading}
      onClose={onRemove ? handleRemove : undefined}
    >
      {role.name}
    </Tag>
  )
}

export default RoleTag
