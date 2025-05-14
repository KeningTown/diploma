import React, { useCallback, useMemo } from 'react'
import { Table, Typography } from 'antd'

import { RecordProps } from '../../model'
import { DocumentProps } from '../../../document'
import { paragraph } from '../../../paragraph'
import { permission } from '../../../permission'

import { TableColumns } from '@/types'
import { DataItem } from './RecordResult.types'

import { renderEntity, renderValue } from './RecordResult.constants'

import * as Styled from './RecordResult.styled'

type Props = {
  document: DocumentProps.Item
  data: RecordProps.Data
}

const RecordResult: React.FC<Props> = ({ document, data }) => {
  const dataSource = useMemo<DataItem[]>(() => {
    let documentRead = 0
    let documentUnderstood = 0
    let documentTotal = 0

    const blocks = Object.entries(data.result)
    const blockItems: DataItem[] = []

    blocks.forEach(([id, blockResult]) => {
      const block = data.blocks.find((block) => block.id === (Number(id) || id))

      if (!block) {
        return
      }

      const paragraphs = Object.entries(blockResult)
      const paragraphItems: DataItem[] = []

      let blockRead = 0
      let blockUnderstood = 0
      let blockTotal = 0

      paragraphs.forEach(([id, { read, understood }]) => {
        const item = block.paragraphs.find((item) => {
          const visible =
            item.type === paragraph.constants.ParagraphType.DEFINITION ||
            item.visible

          return visible && item.id === (Number(id) || id)
        })

        if (!item) {
          return
        }

        const tokens =
          item.type === paragraph.constants.ParagraphType.DEFINITION
            ? item.term?.definition
            : item.text
        const title = tokens ? paragraph.service.tokensToStr(tokens) : undefined
        const total = read * understood

        paragraphItems.push({
          key: id,
          entity: permission.constants.PermissionEntity.PARAGRAPH,
          title,
          read,
          understood,
          total
        })

        blockRead += read
        blockUnderstood += understood
        blockTotal += total
      })

      blockRead /= paragraphs.length
      blockUnderstood /= paragraphs.length
      blockTotal /= paragraphs.length

      blockItems.push({
        key: id,
        entity: permission.constants.PermissionEntity.BLOCK,
        title: block?.title,
        read: blockRead,
        understood: blockUnderstood,
        total: blockTotal,
        items: paragraphItems
      })

      documentRead += blockRead
      documentUnderstood += blockUnderstood
      documentTotal += blockTotal
    })

    documentRead /= blocks.length
    documentUnderstood /= blocks.length
    documentTotal /= blocks.length

    return [
      {
        key: document.id,
        entity: permission.constants.PermissionEntity.DOCUMENT,
        title: document.title,
        read: documentRead,
        understood: documentUnderstood,
        total: documentTotal,
        items: blockItems
      }
    ]
  }, [data, document])

  const columns = useMemo<TableColumns<DataItem>>(() => {
    return [
      {
        dataIndex: 'entity',
        title: 'Объект',
        width: 100,
        render: renderEntity
      },
      {
        dataIndex: 'title',
        title: 'Название',
        ellipsis: true
      },
      {
        dataIndex: 'read',
        title: 'Прочитано',
        width: 100,
        render: renderValue
      },
      {
        dataIndex: 'understood',
        title: 'Усвоено',
        width: 100,
        render: renderValue
      },
      {
        dataIndex: 'total',
        title: 'Усвоено всего',
        width: 120,
        render: renderValue
      }
    ]
  }, [])

  const expandedRowRender = useCallback(
    (item: DataItem) => {
      const expandable = {
        rowExpandable: () => Boolean(item.items?.[0]?.items),
        expandedRowRender
      }

      return (
        <Table
          bordered
          pagination={false}
          showHeader={false}
          size="small"
          dataSource={item.items}
          columns={columns}
          expandable={expandable}
        />
      )
    },
    [columns]
  )

  return (
    <Styled.Container>
      <Typography.Paragraph strong>Показатели мониторинга</Typography.Paragraph>
      <Table
        bordered
        pagination={false}
        size="small"
        dataSource={dataSource}
        columns={columns}
        expandable={{ expandedRowRender }}
      />
    </Styled.Container>
  )
}

export default RecordResult
