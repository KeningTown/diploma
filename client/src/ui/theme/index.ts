import { theme as antdTheme, ThemeConfig } from 'antd'
import * as p from '@ant-design/colors'

import { ATOM } from './constants'

export { SIZE, Size, getGutter } from './constants'

const palette = {
  red: p.red,
  volcano: p.volcano,
  orange: p.orange,
  gold: p.gold,
  yellow: p.yellow,
  lime: p.lime,
  green: p.green,
  cyan: p.cyan,
  blue: p.blue,
  geekblue: p.geekblue,
  purple: p.purple,
  magenta: p.magenta,
  gray: [
    '#fafafa',
    '#f5f5f5',
    '#f0f0f0',
    '#d9d9d9',
    '#bfbfbf',
    '#8c8c8c',
    '#595959',
    '#434343'
  ],
  white: '#fff'
} as const

export const theme = {
  atom: ATOM,
  palette,
  border: `1px solid ${palette.gray[2]}`,
  breakpoint: {
    lg: true
  },
  spacing: (...values: number[]) => {
    return values.map((value) => value * ATOM + 'px').join(' ')
  }
}

export type Theme = typeof theme & {
  breakpoint: {
    lg: boolean
  }
}

export type Color = keyof typeof palette

export const themeConfig: ThemeConfig = {
  ...antdTheme.defaultConfig,
  token: {
    ...antdTheme.defaultConfig.token,
    fontFamily: ''
    // colorWhite: '#fff'
  }
}
