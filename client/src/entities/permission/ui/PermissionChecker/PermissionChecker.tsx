import React from 'react'
import { Result } from 'antd'

import { Permissions } from './PermissionChecker.types'

import { usePermissionChecker } from './usePermissionChecker'

type Props = React.PropsWithChildren<{
  showStatus?: boolean
  permissions: Permissions
}>

const PermissionChecker: React.FC<Props> = ({
  showStatus,
  permissions,
  children
}) => {
  const { checkPermissions } = usePermissionChecker()

  if (!checkPermissions(permissions)) {
    if (!showStatus) {
      return null
    }

    return (
      <Result
        status="403"
        title="403"
        subTitle="У вас нет прав для просмотра этой страницы"
      />
    )
  }

  return children
}

export default PermissionChecker
