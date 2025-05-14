import React, { useCallback } from 'react'

import { role, RoleProps } from '../../model'

import { ADMIN_ROLES } from '@/routes'

import { useRedirect } from '@/hooks'

import { ButtonRequest, Value } from '@/components'

type Props = RoleProps.Item

const DeleteButton: React.FC<Props> = ({ id, name }) => {
  const redirect = useRedirect()

  const handleSuccess = useCallback(() => {
    redirect(ADMIN_ROLES)
  }, [redirect])

  return (
    <ButtonRequest
      danger
      icon="delete"
      request={role.api.delete}
      args={[id]}
      successMessage={
        <>
          Роль{' '}
          <Value inline bold>
            {name}
          </Value>{' '}
          удалена
        </>
      }
      errorMessage="Не удалось удалить роль"
      onSuccess={handleSuccess}
    >
      Удалить
    </ButtonRequest>
  )
}

export default DeleteButton
