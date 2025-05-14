import { Tokens } from './paragraph.types'

export const tokensToStr = (tokens: Tokens) => {
  return tokens
    ?.map((token) => {
      if (typeof token === 'string') {
        return token
      }

      return (token.l || '') + token.w + (token.r || '')
    })
    .join(' ')
}
