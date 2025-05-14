import React, { useCallback } from 'react'

import { term, TermProps } from '@/entities'

import { ADMIN_DICTIONARY_TERMS } from '@/routes'

import { useRedirect } from '@/hooks'

import { ButtonRequest, Value } from '@/components'

type Props = {
  item: TermProps.ItemFull
}

const TermDelete: React.FC<Props> = ({ item }) => {
  const redirect = useRedirect()

  const handleSuccess = useCallback(() => {
    redirect(ADMIN_DICTIONARY_TERMS)
  }, [redirect])

  return (
    <ButtonRequest
      danger
      icon="delete"
      request={term.api.delete}
      args={[item.id]}
      successMessage={
        <>
          Термин{' '}
          <Value inline bold>
            {item.term}
          </Value>{' '}
          удален
        </>
      }
      errorMessage="Не удалось удалить термин"
      onSuccess={handleSuccess}
    >
      Удалить
    </ButtonRequest>
  )
}

export default TermDelete
