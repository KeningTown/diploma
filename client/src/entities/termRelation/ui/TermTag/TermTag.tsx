import React, { useCallback } from 'react'

import { TermRelationProps, termRelation } from '../../model'

import { ADMIN_DICTIONARY_TERM } from '@/routes'

import { router } from '@/services'

import { useNotification, useRequest } from '@/hooks'

import { Tag } from '@/ui'
import { Value } from '@/components'

type Props = {
  item: TermRelationProps.Item
  onRemove?: false | (() => void)
}

const TermTag: React.FC<Props> = ({ item, onRemove }) => {
  const notify = useNotification()

  const { request, isLoading } = useRequest(termRelation.api.delete)

  const oppositeType = termRelation.constants.OPPOSITE_RELATION_TYPE[item.type]
  const color = termRelation.constants.RELATION_TYPE_COLOR[oppositeType]
  const to = router.buildPath(ADMIN_DICTIONARY_TERM, { id: item.term.id })

  const handleRemove = useCallback(() => {
    request(item.id).then(({ error }) => {
      const term = (
        <Value inline bold>
          {item.term.term}
        </Value>
      )

      if (error) {
        return notify('error', <>Не удалось удалить связь с термином {term}</>)
      }

      notify('success', <>Связь с термином {term} удалена</>)
      onRemove && onRemove()
    })
  }, [item, notify, onRemove, request])

  return (
    <Tag
      color={color}
      to={to}
      isClosing={isLoading}
      onClose={onRemove ? handleRemove : undefined}
    >
      {item.term.term}
    </Tag>
  )
}

export default TermTag
