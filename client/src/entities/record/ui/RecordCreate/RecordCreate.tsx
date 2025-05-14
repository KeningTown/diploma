import React, { useCallback } from 'react'
import { FloatButton } from 'antd'

import { record, RecordProps } from '../../model'

import { Blocks } from '@/store/useDocumentStore'

import { useRequest, useNotification } from '@/hooks'

import { Icon } from '@/ui'

type Props = {
  documentId: number
  width: number
  blocks: Blocks
  result: RecordProps.Result
  gazes: RecordProps.Gazes
  synonyms: RecordProps.Synonyms
}

const RecordCreate: React.FC<Props> = ({
  documentId,
  width,
  blocks,
  result,
  gazes,
  synonyms
}) => {
  const notify = useNotification()

  const { request, isLoading } = useRequest(record.api.create)

  const handleClick = useCallback(() => {
    if (isLoading) {
      return
    }

    const blobPart = JSON.stringify({
      width,
      blocks,
      result,
      gazes,
      synonyms
    })
    const file = new File([blobPart], 'data.json', {
      type: 'application/json'
    })

    request({ documentId, file }).then(({ error }) => {
      if (error) {
        return notify('error', 'Не удалось сохранить запись')
      }

      notify('success', 'Запись сохранена')
    })
  }, [
    isLoading,
    width,
    blocks,
    result,
    gazes,
    synonyms,
    request,
    documentId,
    notify
  ])

  return (
    <FloatButton
      type="primary"
      tooltip="Сохранить запись"
      icon={<Icon icon={isLoading ? 'loading' : 'save'} />}
      onClick={handleClick}
    />
  )
}

export default RecordCreate
