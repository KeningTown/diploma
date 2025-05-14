import React, { useCallback } from 'react'

import { group, GroupProps } from '../../model'

import { ADMIN_GROUPS } from '@/routes'

import { useRedirect } from '@/hooks'

import { ButtonRequest, Value } from '@/components'

type Props = {
  item: GroupProps.Item
}

const GroupDelete: React.FC<Props> = ({ item }) => {
  const redirect = useRedirect()

  const handleSuccess = useCallback(() => {
    redirect(ADMIN_GROUPS)
  }, [redirect])

  return (
    <ButtonRequest
      danger
      icon="delete"
      request={group.api.delete}
      args={[item.id]}
      successMessage={
        <>
          Группа{' '}
          <Value inline bold>
            {item.name}
          </Value>{' '}
          удалена
        </>
      }
      errorMessage="Не удалось удалить группу"
      onSuccess={handleSuccess}
    >
      Удалить
    </ButtonRequest>
  )
}

export default GroupDelete
