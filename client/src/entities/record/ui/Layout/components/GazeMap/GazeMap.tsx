import React, { useMemo } from 'react'
import { Line } from 'react-konva'

import { UseWordGazeMap } from '@/hooks/useWordGazeMap'

import { theme } from '@/ui/theme'

type Props = {
  gazes: UseWordGazeMap['gazes']
}

const GazeMap: React.FC<Props> = ({ gazes }) => {
  const chunks = useMemo(() => {
    const chunks: number[][] = [[]]

    let j = 0
    let leftToRight = true

    gazes.forEach(([x, y], i) => {
      const prevGaze = gazes[i - 1]

      if (prevGaze && (leftToRight ? x < prevGaze[0] : x > prevGaze[0])) {
        leftToRight = !leftToRight
        j++

        chunks[j] = [prevGaze[0], prevGaze[1]]
      }

      chunks[j].push(x, y)
    })

    return chunks
  }, [gazes])

  return (
    <>
      {chunks.map((chunk, i) => {
        const stroke =
          i % 2 === 0 ? theme.palette.purple[5] : theme.palette.magenta[5]

        return (
          <Line
            key={i}
            points={chunk}
            tension={0.5}
            opacity={0.5}
            lineCap="round"
            strokeWidth={2}
            stroke={stroke}
          />
        )
      })}
    </>
  )
}

export default GazeMap
