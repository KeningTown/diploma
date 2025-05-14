import React, { useMemo } from 'react'
import { Typography } from 'antd'

import { COLUMN_SEPARATOR, EMPTY, LEFT, RIGHT } from './Table.constants'

import * as Styled from './Table.styled'

type Props = {
  parts: string[]
}

const Table: React.FC<Props> = ({ parts }) => {
  const title = useMemo(
    () => (parts[0].includes(COLUMN_SEPARATOR) ? null : parts[0]),
    [parts]
  )

  const data = useMemo(() => {
    const rows = parts.slice(title ? 1 : 0)

    return rows.map((row) => {
      const columns = row.split(COLUMN_SEPARATOR)

      return columns.reduce<string[][]>((items, column, i) => {
        if (column) {
          const cells: string[] = [column]

          for (let j = i + 1; j < columns.length; j++) {
            const item = columns[j]

            if (item || item === undefined) {
              break
            }

            cells.push(item)
          }

          items.push(cells)
        } else if (i === 0) {
          items.push([EMPTY])
        }

        return items
      }, [])
    })
  }, [parts, title])

  const rows = useMemo(() => {
    return data.map((row, i) => {
      const cells = row.map((column, j) => {
        const [str] = column

        if (!str) {
          return null
        }

        let rowSpan = 1

        for (let k = i + 1; k < data.length; k++) {
          if (data[k][j]?.[0] !== EMPTY) {
            break
          }

          rowSpan++
        }

        const isLeft = str[0] === LEFT
        const isRight = str[str.length - 1] === RIGHT
        const content = str.substring(
          isLeft ? 1 : 0,
          isRight ? str.length - 1 : undefined
        )

        const text = content.split('\\n').map((item, i) => {
          const words = item.split('\\s')

          return (
            <React.Fragment key={i}>
              {i !== 0 && <br />}
              {words.map((word, i) => {
                return (
                  <React.Fragment key={i}>
                    {i !== 0 && <>&nbsp;</>}
                    {word}
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          )
        })

        return (
          <Styled.Td
            key={j}
            rowSpan={rowSpan}
            colSpan={column.length}
            $isLeft={isLeft}
            $isRight={isRight}
          >
            {text}
          </Styled.Td>
        )
      })

      return <tr key={i}>{cells}</tr>
    })
  }, [data])

  return (
    <>
      {title && (
        <Styled.Title as={Typography.Paragraph} italic>
          {title}
        </Styled.Title>
      )}
      <Styled.Container>
        <Styled.Table>
          <tbody>{rows}</tbody>
        </Styled.Table>
      </Styled.Container>
    </>
  )
}

export default Table
