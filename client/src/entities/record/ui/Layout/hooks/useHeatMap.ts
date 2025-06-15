import React, { useRef, useCallback, useEffect } from 'react'

import { RecordProps } from '../../../../record'

export const useHeatMap = (show: boolean) => {
  const heatMap: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null)

  const setVisibility = useCallback((visible: boolean) => {
    if (heatMap.current) {
      heatMap.current.style.visibility = visible ? 'visible' : 'hidden'
    }
  }, [])

  const createHeatMap = useCallback(
    (container: HTMLDivElement, gazes: RecordProps.Gazes) => {
      if (heatMap.current) {
        return
      }

      let max = 0
      const points: Record<string, number> = {}
      gazes.forEach(([x, y, v]) => {
        const key = `${Math.round(x)}_${Math.round(y)}`

        if (!points[key]) {
          points[key] = 0
        }

        const value = points[key] + v

        points[key] = value

        if (v > max) {
          max = value
        }
      })

      const data = Object.entries(points).map(([key, value]) => {
        const [x, y] = key.split('_').map(Number)

        return { x, y, value }
      })

      const heat = window.h337.create({ container })
      heat.setData({
        min: 0,
        max,
        data
      })
      heatMap.current = heat._renderer.canvas
      setVisibility(false)
    },
    [setVisibility]
  )

  useEffect(() => {
    setVisibility(show)
  }, [setVisibility, show])

  return {
    createHeatMap
  }
}
