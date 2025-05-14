import React, { useCallback } from 'react'

import { UserProps, user } from '../../model'

import { useNotification } from '@/hooks'

import { ButtonRequest, Value } from '@/components'

type Props = {
  item: UserProps.Item
}

const UserChangePassword: React.FC<Props> = ({ item }) => {
  const notify = useNotification()

  const handleSuccess = useCallback(
    (data: UserProps.UpdatePasswordResponse) => {
      notify(
        'success',
        'Пароль изменен',
        <>
          Новый пароль{' '}
          <Value inline bold copy>
            {data.data.password}
          </Value>
        </>
      )
    },
    [notify]
  )

  return (
    <ButtonRequest
      request={user.api.updatePassword}
      args={[item.id]}
      errorMessage="Не удалось изменить пароль"
      onSuccess={handleSuccess}
    >
      Изменить пароль
    </ButtonRequest>
  )
}

export default UserChangePassword
