import React, { useMemo } from 'react'
import { DescriptionsProps } from 'antd'

import { TermProps, term } from '../../model'
import {
  TermRelation,
  termRelation,
  TermRelationProps
} from '../../../termRelation'
import { Permission, permission } from '../../../permission'

import { Details, TagGroup, ButtonTooltip } from '@/ui'
import { Value } from '@/components'

type Props = {
  item: TermProps.ItemFull
  reload: () => void
}

const TermInfo: React.FC<Props> = ({ item, reload }) => {
  const { checkPermissions } = Permission.usePermissionChecker()

  const items = useMemo(() => {
    const items: DescriptionsProps['items'] = [
      {
        label: term.constants.FIELD_RU.id,
        children: <Value copy>{item.id}</Value>
      },
      {
        label: term.constants.FIELD_RU.term,
        children: item.term
      },
      {
        label: term.constants.FIELD_RU.definition,
        children: item.definition
      }
    ]

    const canListTermRelation = checkPermissions({
      [permission.constants.PermissionEntity.TERM_RELATION]:
        permission.constants.PermissionAction.LIST
    })

    if (canListTermRelation) {
      const excluded = [
        item.id,
        ...item.relations.flatMap(({ term }) => term.id)
      ]
      const canCreateTermRelation = checkPermissions({
        [permission.constants.PermissionEntity.TERM_RELATION]:
          permission.constants.PermissionAction.CREATE
      })
      const canDeleteTermRelation = checkPermissions({
        [permission.constants.PermissionEntity.TERM_RELATION]:
          permission.constants.PermissionAction.DELETE
      })
      const relations = Object.entries(
        termRelation.constants.OPPOSITE_RELATION_TYPE
      ).map(([type, oppositeType]) => {
        const relationType = type as TermRelationProps.Type
        const label = termRelation.constants.RELATION_TYPE_RU[relationType]
        const text =
          termRelation.constants.RELATION_TYPE_DEFINITION_RU[relationType]
        const relations = item.relations.filter((relation) => {
          return relation.type === oppositeType
        })

        return {
          label: (
            <>
              {label}
              <ButtonTooltip text={text} />
            </>
          ),
          children: (
            <TagGroup
              addModalHidden={!canCreateTermRelation}
              addModal={(props) => (
                <TermRelation.AddRelationsModal
                  {...props}
                  termId={item.id}
                  relationType={oppositeType}
                  excluded={excluded}
                  onSuccess={reload}
                />
              )}
            >
              {relations.map((item) => {
                return (
                  <TermRelation.TermTag
                    key={item.id}
                    item={item}
                    onRemove={canDeleteTermRelation && reload}
                  />
                )
              })}
            </TagGroup>
          )
        }
      })

      items.push(...relations)
    }

    return items
  }, [item, reload, checkPermissions])

  return <Details items={items} />
}

export default TermInfo
