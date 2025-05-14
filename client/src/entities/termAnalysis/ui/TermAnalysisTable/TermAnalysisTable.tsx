import React, { useMemo } from 'react'
import { Table, Tag } from 'antd'

import { TermAnalysisProps } from '../../model'
import { TermProps, term } from '../../../term'
import { termRelation } from '../../../termRelation'
import { Permission, permission } from '../../../permission'

import { TableColumns } from '@/types'

import { TagGroup } from '@/ui'
import TermTag from '../TermTag/TermTag'

type Props = {
  item: TermAnalysisProps.Item
  onSuccess: () => void
}

const TermAnalysisTable: React.FC<Props> = ({ item, onSuccess }) => {
  const { checkPermissions } = Permission.usePermissionChecker()

  const dataSource = useMemo(
    () => item.terms.map((item) => ({ ...item, key: item.id })),
    [item.terms]
  )

  const columns = useMemo(() => {
    const canUpdateTerm = checkPermissions({
      [permission.constants.PermissionEntity.TERM]:
        permission.constants.PermissionAction.UPDATE
    })

    const columns: TableColumns<TermProps.ItemFull> = [
      {
        dataIndex: 'term',
        title: term.constants.FIELD_RU.term,
        render: (_, item) => (
          <TagGroup>
            <TermTag item={item} onSuccess={canUpdateTerm && onSuccess} />
          </TagGroup>
        )
      }
    ]

    const canListTermRelation = checkPermissions({
      [permission.constants.PermissionEntity.TERM_RELATION]:
        permission.constants.PermissionAction.LIST
    })

    if (canListTermRelation) {
      columns.push({
        dataIndex: 'relations',
        title: term.constants.FIELD_RU.relations,
        render: (relations) => (
          <TagGroup>
            {relations.map((item) => {
              const oppositeType =
                termRelation.constants.OPPOSITE_RELATION_TYPE[item.type]
              const color =
                termRelation.constants.RELATION_TYPE_COLOR[oppositeType]

              return (
                <TermTag
                  key={item.id}
                  color={color}
                  item={item.term}
                  onSuccess={canUpdateTerm && onSuccess}
                />
              )
            })}
          </TagGroup>
        )
      })
    }

    columns.push({
      dataIndex: 'frequency',
      title: 'Частота',
      render: (frequency) =>
        frequency !== undefined && (
          <Tag bordered={false}>{(frequency * 100).toFixed(2)} %</Tag>
        )
    })

    return columns
  }, [onSuccess, checkPermissions])

  return (
    <Table
      bordered
      pagination={false}
      size="small"
      columns={columns}
      dataSource={dataSource}
    />
  )
}

export default TermAnalysisTable
