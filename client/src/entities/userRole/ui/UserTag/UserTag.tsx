import React, { useMemo } from 'react'

import { userRole } from '../../model'
import { user } from '../../../user'
import { RoleProps } from '../../../role/model'

import { ADMIN_USERS } from '@/routes'

import { useNotification, useRequest } from '@/hooks'

import { Tag } from '@/ui'
import { Value } from '@/components'

type Props = RoleProps.RoleUser & {
  onRemove?: false | (() => void)
}

const UserTag: React.FC<Props> = ({ id, user: item, onRemove }) => {
  const notify = useNotification()

  const { request, isLoading } = useRequest(userRole.api.delete)

  const name = useMemo(() => user.service.getShortName(item), [item])

  const handleRemove = () => {
    request(id).then(({ error }) => {
      const user = (
        <Value inline bold>
          {name}
        </Value>
      )

      if (error) {
        return notify(
          'error',
          <>Не удалось удалить роль для пользователя {user}</>
        )
      }

      notify('success', <>Для пользователя {user} удалена роль</>)
      onRemove && onRemove()
    })
  }

  return (
    <Tag
      to={`${ADMIN_USERS}/${item.id}`}
      isClosing={isLoading}
      onClose={onRemove ? handleRemove : undefined}
    >
      {name}
    </Tag>
  )
}

export default UserTag
