export const ATOM = 8

export enum Size {
  S = 's',
  M = 'm',
  L = 'l',
  XL = 'xl'
}

export const SIZE = {
  [Size.S]: ATOM,
  [Size.M]: ATOM * 1.5,
  [Size.L]: ATOM * 2,
  [Size.XL]: ATOM * 3
} as const

export const getGutter = (h: number, v?: number): [number, number] => {
  return [ATOM * h, ATOM * (v || h)]
}
