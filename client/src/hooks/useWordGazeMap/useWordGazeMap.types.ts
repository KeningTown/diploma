export type Box = { x: number; y: number; width: number; height: number }

export type Word = Box & {
  id: string
  uid: string
  blockId: number
  paragraphId: number | string
  termId?: number
  value: string
  weight: number
  synonyms?: number[]
  hasDefinition: boolean
  origin?: string
}

export type Words = Word[]

export type WordGazeMap = Record<string, number>
