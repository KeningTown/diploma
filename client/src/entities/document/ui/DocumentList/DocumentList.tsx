import React, { useMemo } from 'react'
import { Table } from 'antd'

import { DocumentProps } from '../../model'
import { Permission } from '../../../permission'

import { getColumns } from './DocumentList.constants'

type Props = {
  isLoading?: boolean
  data?: DocumentProps.List
}

const DocumentList: React.FC<Props> = ({ isLoading, data }) => {
  const { checkPermissions } = Permission.usePermissionChecker()

  const dataSource = useMemo(
    () => data?.data.map((item) => ({ ...item, key: item.id })),
    [data?.data]
  )

  const columns = useMemo(
    () => getColumns(checkPermissions),
    [checkPermissions]
  )

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

export default DocumentList
