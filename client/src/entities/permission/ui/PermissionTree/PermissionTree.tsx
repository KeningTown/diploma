import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Tree, TreeDataNode } from 'antd'

import { permission, PermissionProps } from '../../model'

import { useRequest } from '@/hooks'

const READ_DEPENDENCIES: string[] = [
  permission.constants.PermissionAction.CREATE,
  permission.constants.PermissionAction.UPDATE,
  permission.constants.PermissionAction.DELETE,
  permission.constants.PermissionAction.LIST
]

type Props = {
  initial?: number[]
  onChange: (value: number[]) => void
}

const PermissionTree: React.FC<Props> = ({ initial, onChange }) => {
  const { data } = useRequest(permission.api.list, [])

  const [checkedPermissions, setCheckedPermissions] = useState(initial)

  useEffect(() => {
    if (!initial) return

    setCheckedPermissions(initial)
  }, [initial])

  const permissions = useMemo(() => data?.data || [], [data])

  const idPermissionMap = useMemo(
    () => Object.fromEntries(permissions.map((item) => [item.id, item])),
    [permissions]
  )

  const entityActionIdMap = useMemo(
    () => permission.service.getEntityActionIdMap(permissions),
    [permissions]
  )

  const tree = useMemo<TreeDataNode[]>(
    () =>
      Object.entries(entityActionIdMap).map(([entity, obj]) => {
        const entries = Object.entries(obj)

        return {
          key: entity,
          title:
            permission.constants.PERMISSION_ENTITY_RU[
              entity as PermissionProps.PermissionEntity
            ],
          selectable: false,
          // checkable: false,
          children: entries.map(([action, id]) => ({
            key: id,
            title:
              permission.constants.PERMISSION_ACTION_RU[
                action as PermissionProps.PermissionAction
              ],
            selectable: false,
            disabled:
              action === permission.constants.PermissionAction.READ &&
              entries.some(
                ([action, id]) =>
                  READ_DEPENDENCIES.includes(action) &&
                  checkedPermissions?.includes(id)
              )
          }))
        }
      }),
    [checkedPermissions, entityActionIdMap]
  )

  const handleCheckPermission = useCallback(
    (keys: number[]) => {
      const checked = keys.filter((key) => typeof key === 'number')
      const set = new Set(checked)

      checked.forEach((id) => {
        const p = idPermissionMap[id]

        if (READ_DEPENDENCIES.includes(p.action)) {
          const id =
            entityActionIdMap[p.entity]?.[
              permission.constants.PermissionAction.READ
            ]

          id && set.add(id)
        }
      })

      const value = [...set.values()]

      setCheckedPermissions(value)
      onChange(value)
    },
    [entityActionIdMap, idPermissionMap, onChange]
  )

  return (
    tree.length && (
      <Tree
        checkable
        // defaultExpandAll
        checkedKeys={checkedPermissions}
        treeData={tree}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onCheck={handleCheckPermission as any}
      />
    )
  )
}

export default PermissionTree
