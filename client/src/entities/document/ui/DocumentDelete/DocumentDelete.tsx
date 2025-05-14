import React, { useCallback } from 'react'

import { DocumentProps, document } from '../../model'

import { ADMIN_DOCUMENTS } from '@/routes'

import { useRedirect } from '@/hooks'

import { ButtonRequest, Value } from '@/components'

type Props = {
  item: DocumentProps.Item
}

const DocumentDelete: React.FC<Props> = ({ item }) => {
  const redirect = useRedirect()

  const handleSuccess = useCallback(() => {
    redirect(ADMIN_DOCUMENTS)
  }, [redirect])

  return (
    <ButtonRequest
      danger
      icon="delete"
      request={document.api.delete}
      args={[item.id]}
      successMessage={
        <>
          Документ{' '}
          <Value inline bold>
            {item.title}
          </Value>{' '}
          удален
        </>
      }
      errorMessage="Не удалось удалить документ"
      onSuccess={handleSuccess}
    >
      Удалить
    </ButtonRequest>
  )
}

export default DocumentDelete
