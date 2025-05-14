import React, { useCallback, useState, useEffect } from 'react'
import { Modal, Input, Space } from 'antd'

import {
  EMPTY,
  NEW_LINE,
  TABLE_TAG,
  COLUMN_SEPARATOR
} from '../Table/Table.constants'

import { ModalProps, Button } from '@/ui'

import * as Styled from './TableEditor.styled'

type Columns = string[]
type Rows = Columns[]

const INITIAL_ROWS: Rows = [[EMPTY]]

type Props = ModalProps & {
  value?: string
  onApply: (value: string) => void
}

const TableEditor: React.FC<Props> = ({ open, value, onApply, onCancel }) => {
  const [title, setTitle] = useState(EMPTY)
  const [rows, setRows] = useState(INITIAL_ROWS)

  useEffect(() => {
    const parts = value?.split(NEW_LINE)

    if (!parts || parts[0] !== TABLE_TAG) {
      setTitle(EMPTY)
      setRows(INITIAL_ROWS)
      return
    }

    let title = EMPTY

    if (!parts[1].includes(COLUMN_SEPARATOR)) {
      title = parts[1]
    }

    setTitle(title)

    const rows = parts.slice(title ? 2 : 1).map((row) => {
      return row.split(COLUMN_SEPARATOR)
    })

    setRows(rows)
  }, [value])

  const handleChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTitle(e.target.value)
    },
    []
  )

  const handleChangeCell = useCallback(
    (rowIndex: number, columnIndex: number) => {
      return (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRows((rows) => {
          return rows.map((row, i) => {
            return row.map((column, j) => {
              if (i === rowIndex && j === columnIndex) {
                return e.target.value
              }

              return column
            })
          })
        })
      }
    },
    []
  )

  const handleAddColumn = useCallback((i: number) => {
    setRows((rows) => {
      return rows.map((row) => {
        return row.reduce<Columns>((columns, column, j) => {
          columns.push(column)

          if (j === i) {
            columns.push(EMPTY)
          }

          return columns
        }, [])
      })
    })
  }, [])

  const handleAddRow = useCallback((i: number) => {
    setRows((rows) => {
      return rows.reduce<Rows>((rows, row, j) => {
        rows.push(row)

        if (j === i) {
          rows.push([...new Array(row.length)].map(() => EMPTY))
        }

        return rows
      }, [])
    })
  }, [])

  const handleDeleteColumn = useCallback((i: number) => {
    setRows((rows) => {
      return rows.map((row) => {
        return row.filter((_, j) => i !== j)
      })
    })
  }, [])

  const handleDeleteRow = useCallback((i: number) => {
    setRows((rows) => {
      return rows.filter((_, j) => j !== i)
    })
  }, [])

  const handleOk = useCallback(() => {
    const _rows = rows.map((row) => {
      return row.join(COLUMN_SEPARATOR)
    })

    const lines = [TABLE_TAG, title ? [title, _rows] : _rows].flat(2)
    const value = lines.join(NEW_LINE)

    onApply(value)
    onCancel()
  }, [onApply, onCancel, rows, title])

  return (
    <Modal
      destroyOnClose
      title="Редактирование таблицы"
      okText="Применить"
      width={1200}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      style={{ top: 24 }}
    >
      <Styled.Container as={Space} direction="vertical" size="large">
        <Input.TextArea
          autoSize
          name="title"
          placeholder="Заголовок таблицы"
          value={title}
          onChange={handleChangeTitle}
        />
        <Styled.Table>
          <tbody>
            {rows.map((row, i) => {
              return (
                <tr key={i}>
                  {row.map((column, j) => {
                    return (
                      <Styled.Td key={j}>
                        <Input.TextArea
                          autoSize
                          name={i + '_' + j}
                          value={column}
                          onChange={handleChangeCell(i, j)}
                        />
                        {i === 0 && (
                          <Styled.AddColumn
                            as={Button}
                            icon="plus"
                            size="small"
                            type="text"
                            onClick={() => handleAddColumn(j)}
                          />
                        )}
                        {j === 0 && (
                          <Styled.AddRow
                            as={Button}
                            icon="plus"
                            size="small"
                            type="text"
                            onClick={() => handleAddRow(i)}
                          />
                        )}
                        {i === 0 && row.length > 1 && (
                          <Styled.DeleteColumn
                            as={Button}
                            danger
                            icon="close"
                            size="small"
                            type="text"
                            onClick={() => handleDeleteColumn(j)}
                          />
                        )}
                        {j === 0 && rows.length > 1 && (
                          <Styled.DeleteRow
                            as={Button}
                            danger
                            icon="close"
                            size="small"
                            type="text"
                            onClick={() => handleDeleteRow(i)}
                          />
                        )}
                      </Styled.Td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </Styled.Table>
      </Styled.Container>
    </Modal>
  )
}

export default TableEditor
