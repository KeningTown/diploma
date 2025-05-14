import React, { useMemo } from 'react'
import { Table } from 'antd'

import { TableColumns } from '@/types'

import { TermProps, term } from '../../model'
import { TermRelation } from '../../../termRelation'
import { Permission, permission } from '../../../permission'

import { ADMIN_DICTIONARY_TERM } from '@/routes'

import { Value } from '@/components'
import { ButtonLink, TagGroup } from '@/ui'

type Props = {
  isLoading?: boolean
  data?: TermProps.List
}

const TermList: React.FC<Props> = ({ isLoading, data }) => {
  const { checkPermissions } = Permission.usePermissionChecker()

  const dataSource = useMemo(
    () => data?.data.map((item) => ({ ...item, key: item.id })),
    [data?.data]
  )

  const columns = useMemo(() => {
    const columns: TableColumns<TermProps.ItemFull> = [
      {
        dataIndex: 'id',
        title: term.constants.FIELD_RU.id,
        render: (id) => <Value copy>{id}</Value>
      },
      {
        dataIndex: 'term',
        title: term.constants.FIELD_RU.term
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
              return <TermRelation.TermTag key={item.id} item={item} />
            })}
          </TagGroup>
        )
      })
    }

    const canReadTerm = checkPermissions({
      [permission.constants.PermissionEntity.TERM]:
        permission.constants.PermissionAction.READ
    })

    if (canReadTerm) {
      columns.push({
        dataIndex: 'id',
        render: (id) => (
          <ButtonLink to={ADMIN_DICTIONARY_TERM} params={{ id }} />
        )
      })
    }

    return columns
  }, [checkPermissions])

  return (
    <Table
      bordered
      pagination={false}
      size="small"
      loading={isLoading}
      columns={columns}
      dataSource={dataSource}
    />
  )
}

export default TermList
