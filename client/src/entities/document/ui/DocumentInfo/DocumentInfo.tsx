import React, { useMemo } from 'react'
import { DescriptionsProps } from 'antd'

import { DocumentProps, document } from '../../model'
import { DocumentGroup } from '../../../documentGroup'
import { Permission, permission } from '../../../permission'

import { Details, TagGroup } from '@/ui'
import { Fetcher, Value } from '@/components'

type Props = {
  item: DocumentProps.Item
}

const DocumentInfo: React.FC<Props> = ({ item }) => {
  const { checkPermissions } = Permission.usePermissionChecker()

  const items = useMemo(() => {
    const items: DescriptionsProps['items'] = [
      {
        label: document.constants.DOCUMENT_FIELD_RU.id,
        children: <Value copy>{item.id}</Value>
      },
      {
        label: document.constants.DOCUMENT_FIELD_RU.title,
        children: item.title
      },
      {
        label: document.constants.DOCUMENT_FIELD_RU.abstract,
        children: item.abstract
      }
    ]

    const canListDocumentGroup = checkPermissions({
      [permission.constants.PermissionEntity.DOCUMENT_GROUP]:
        permission.constants.PermissionAction.LIST
    })

    if (canListDocumentGroup) {
      const canCreateDocumentGroup = checkPermissions({
        [permission.constants.PermissionEntity.DOCUMENT_GROUP]:
          permission.constants.PermissionAction.CREATE
      })
      const canDeleteDocumentGroup = checkPermissions({
        [permission.constants.PermissionEntity.DOCUMENT_GROUP]:
          permission.constants.PermissionAction.DELETE
      })

      items.push({
        label: document.constants.DOCUMENT_FIELD_RU.groups,
        children: (
          <Fetcher loader fromPath request={document.api.listGroups}>
            {({ data, reload }) => (
              <TagGroup
                addModalHidden={!canCreateDocumentGroup}
                addModal={(props) => (
                  <DocumentGroup.AddGroupsModal
                    {...props}
                    documentId={item.id}
                    excluded={data.data.map((item) => item.group.id)}
                    onSuccess={reload}
                  />
                )}
              >
                {data.data.map((documentGroup) => (
                  <DocumentGroup.GroupTag
                    key={documentGroup.id}
                    {...documentGroup}
                    onRemove={canDeleteDocumentGroup && reload}
                  />
                ))}
              </TagGroup>
            )}
          </Fetcher>
        )
      })
    }

    return items
  }, [item, checkPermissions])

  return <Details items={items} />
}

export default DocumentInfo
