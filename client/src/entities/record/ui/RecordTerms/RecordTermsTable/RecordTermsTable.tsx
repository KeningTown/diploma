import React, { useMemo } from 'react'
import { Table } from 'antd'

import { RecordProps } from '../../../model'
import { TermProps } from '../../../../term'
import { paragraph } from '../../../../paragraph'

import { TableColumns } from '@/types'
import { DataItem } from './RecordTermsTable.types'

import { renderValue } from '../../RecordResult/RecordResult.constants'

type Props = {
  data: RecordProps.Data
  terms: TermProps.ItemFull[]
}

const RecordTermsTable: React.FC<Props> = ({ data, terms }) => {
  const dataSource = useMemo<DataItem[]>(() => {
    const termsData: Record<
      number,
      Omit<DataItem, 'key' | 'total'> & { understood: number }
    > = {}

    data.blocks.forEach((block) => {
      block.paragraphs.forEach((item) => {
        const text =
          item.type === paragraph.constants.ParagraphType.DEFINITION
            ? item.term?.definition
            : item.text

        if (!text || typeof text === 'string') return

        text.forEach((token) => {
          if (typeof token === 'string' || token.id === undefined) {
            return
          }

          const term = terms.find((term) => term.id === token.id)

          if (!term) {
            return
          }

          const id = ['word', block.id, item.id, token.id, token.uid].join(
            '___'
          )
          const value = data.result[block.id]?.[item.id]?.words[id] || 0

          if (!termsData[term.id]) {
            const synonym = terms.find(
              (item) => item.id === data.synonyms[term.id]
            )?.term

            termsData[term.id] = {
              term: term.term,
              synonym,
              understood: 0,
              misunderstood: 0,
              unread: 0
            }
          }

          const termData = termsData[term.id]

          if (value === 0) {
            termData.unread++
          } else if (value === 0.5) {
            termData.misunderstood++
          } else {
            termData.understood++
          }
        })
      })
    })

    return Object.entries(termsData).map(([key, data]) => {
      const read = data.understood + data.misunderstood
      const total = read + data.unread

      return {
        ...data,
        key: Number(key),
        total: data.understood / total,
        understood: read ? data.understood / read : undefined
      }
    })
  }, [data.blocks, data.result, data.synonyms, terms])

  const columns = useMemo<TableColumns<DataItem>>(() => {
    return [
      {
        dataIndex: 'term',
        title: 'Термин'
      },
      {
        dataIndex: 'synonym',
        title: 'Синоним'
      },
      {
        dataIndex: 'understood',
        title: 'Усвоено',
        render: renderValue
      },
      {
        dataIndex: 'total',
        title: 'Усвоено всего',
        render: renderValue
      }
    ]
  }, [])

  return (
    <Table
      bordered
      pagination={false}
      size="small"
      dataSource={dataSource}
      columns={columns}
    />
  )
}

export default RecordTermsTable
