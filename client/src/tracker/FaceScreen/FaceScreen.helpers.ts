import { getHypot } from '../helpers'

export const getPpMm = (screenDiagonal: number) => {
  return (
    getHypot(window.screen.width, window.screen.height) /
    (screenDiagonal * 2.54 * 10)
  )
}
