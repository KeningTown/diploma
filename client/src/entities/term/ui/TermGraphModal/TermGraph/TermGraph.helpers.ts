import { termRelation } from '../../../../termRelation'

import { Node, Link, Point } from './TermGraph.types'

const NODE_FONT_SIZE = 8
const LINK_FONT_SIZE = 5

const getNodeCoords = (node: Node): Point => {
  return {
    x: node.x || 0,
    y: node.y || 0
  }
}

const renderRect = (node: Node, ctx: CanvasRenderingContext2D) => {
  if (!node.w || !node.h) {
    return
  }

  const { x, y } = getNodeCoords(node)

  ctx.fillRect(x - node.w / 2, y - node.h / 2, node.w, node.h)
}

export const renderNode = (node: Node, ctx: CanvasRenderingContext2D) => {
  ctx.font = `${NODE_FONT_SIZE}px Inter`

  const textWidth = ctx.measureText(node.label).width

  node.w = textWidth
  node.h = NODE_FONT_SIZE

  ctx.fillStyle = 'white'

  renderRect(node, ctx)

  const { x, y } = getNodeCoords(node)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = node.color || 'black'

  ctx.fillText(node.label, x, y)
}

export const renderNodeArea = (
  node: Node,
  color: string,
  ctx: CanvasRenderingContext2D
) => {
  ctx.fillStyle = color

  renderRect(node, ctx)
}

const lerp = (p1: Point, p2: Point, f: number): Point => {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y

  const x = p1.x + dx * f
  const y = p1.y + dy * f

  return { x, y }
}

export const renderLink = (link: Link, ctx: CanvasRenderingContext2D) => {
  if (typeof link.source === 'number' || typeof link.target === 'number') {
    return
  }

  ctx.font = `${LINK_FONT_SIZE}px Inter`

  const label = termRelation.constants.RELATION_TYPE_GRAPH_RU[link.type]
  // const textWidth = ctx.measureText(label).width

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = link.source.color || 'gray'

  const s = getNodeCoords(link.source)
  const t = getNodeCoords(link.target)

  // const a = Math.atan2(s.y - t.y, s.x - t.x) + Math.PI / 2

  // const x = cx + (textWidth / 2 + 2) * Math.cos(a)
  // const y = cy + (textWidth / 2 + 2) * Math.sin(a)

  const { x, y } = lerp(s, t, 0.6)

  ctx.fillText(label, x, y)
}
