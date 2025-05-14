import React, { useRef, useState, useMemo } from 'react'
import useResizeObserver from '@react-hook/resize-observer'
import ForceGraph2D from 'react-force-graph-2d'

import { TermProps } from '../../../model'

import { Node, Link } from './TermGraph.types'

import { renderNode, renderNodeArea, renderLink } from './TermGraph.helpers'

type Props = TermProps.List

const TermGraph: React.FC<Props> = ({ data }) => {
  const target = useRef<HTMLDivElement>(null)

  const [size, setSize] = useState({ width: 0, height: 0 })

  useResizeObserver(target, (entry) => {
    setSize({
      width: entry.contentRect.width,
      height: entry.contentRect.height
    })
  })

  const graphData = useMemo(() => {
    const links: Link[] = []
    const nodes: Node[] = data.map(({ id, term, relations }) => {
      relations.forEach((relation) => {
        links.push({
          source: id,
          target: relation.term.id,
          type: relation.type
        })
      })

      return { id, label: term }
    })

    return { nodes, links }
  }, [data])

  return (
    <div ref={target}>
      <ForceGraph2D
        {...size}
        backgroundColor="white"
        linkDirectionalArrowLength={5}
        linkDirectionalArrowRelPos={1}
        // linkCurvature={0.2}
        linkWidth={1}
        linkCanvasObjectMode={() => 'before'}
        // d3VelocityDecay={0.1}
        graphData={graphData}
        nodeCanvasObject={renderNode}
        nodePointerAreaPaint={renderNodeArea}
        linkCanvasObject={renderLink}
      />
    </div>
  )
}

export default TermGraph
