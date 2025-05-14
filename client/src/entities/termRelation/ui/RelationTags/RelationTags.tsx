import React from 'react'

import { termRelation, TermRelationProps } from '../../model'

import { TagGroup, Tag, ButtonTooltip } from '@/ui'

const RelationTags: React.FC = () => {
  return (
    <TagGroup>
      {Object.entries(termRelation.constants.RELATION_TYPE_RU).map(
        ([key, value]) => {
          const type = key as TermRelationProps.Type
          const color = termRelation.constants.RELATION_TYPE_COLOR[type]
          const text = termRelation.constants.RELATION_TYPE_DEFINITION_RU[type]

          return (
            <Tag key={key} color={color} extra={<ButtonTooltip text={text} />}>
              {value.toLowerCase()}
            </Tag>
          )
        }
      )}
    </TagGroup>
  )
}

export default RelationTags
