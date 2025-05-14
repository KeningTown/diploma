import React from 'react'

import { TermProps, Term } from '../../../term'

import { ADMIN_DICTIONARY_TERM } from '@/routes'

import { router } from '@/services'

import { Tag, TagProps, ButtonModal } from '@/ui'

type Props = {
  color?: TagProps['color']
  item: TermProps.Item
  onSuccess?: false | (() => void)
}

const TermTag: React.FC<Props> = ({ color, item, onSuccess }) => {
  return (
    <Tag
      color={color}
      to={
        item.isActive &&
        router.buildPath(ADMIN_DICTIONARY_TERM, { id: item.id })
      }
      extra={
        !item.isActive &&
        onSuccess && (
          <ButtonModal
            icon="plus"
            size="small"
            type="text"
            modal={(props) => (
              <Term.TermFormModal
                {...props}
                fromAnalysis
                item={item}
                onSuccess={onSuccess}
              />
            )}
          />
        )
      }
    >
      {item.term}
    </Tag>
  )
}

export default TermTag
