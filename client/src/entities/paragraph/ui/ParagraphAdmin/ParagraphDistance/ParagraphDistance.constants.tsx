/* eslint-disable react-refresh/only-export-components */
import React from 'react'

import { TagProps } from '@/ui'

const CORRELATION = {
  NO: 'NO', // отсутствует
  WEAK: 'WEAK', // слабая
  MORERATE: 'MORERATE', // умеренная
  NOTABLE: 'NOTABLE', // заметная
  STRONG: 'STRONG' // сильная
} as const

const CORRELATION_VALUE = {
  [CORRELATION.WEAK]: 0.1,
  [CORRELATION.MORERATE]: 0.3,
  [CORRELATION.NOTABLE]: 0.5,
  [CORRELATION.STRONG]: 0.7
} as const

const CORRELATION_COLOR: Record<keyof typeof CORRELATION, TagProps['color']> = {
  [CORRELATION.NO]: 'red',
  [CORRELATION.WEAK]: 'orange',
  [CORRELATION.MORERATE]: 'gold',
  [CORRELATION.NOTABLE]: 'green',
  [CORRELATION.STRONG]: 'geekblue'
}

const CORRELATION_RU = {
  [CORRELATION.NO]: <>Отсутствует связь с предыдущим абзацем</>,
  [CORRELATION.WEAK]: <>Слабая связь с предыдущим абзацем</>,
  [CORRELATION.MORERATE]: (
    <>
      Умеренная связь с предыдущим абзацем. Возможно, данный абзац дополняет
      смысл предыдущего абзаца. Рекомендуется установить тип абзаца
      «Дополнительный»
    </>
  ),
  [CORRELATION.NOTABLE]: (
    <>
      Заметная связь с предыдущим абзацем. Возможно, данный абзац расскрывает
      смысл предыдущего абзаца. Рекомендуется установить тип абзаца
      «Расскрывающий»
    </>
  ),
  [CORRELATION.STRONG]: (
    <>
      Сильная связь с предыдущим абзацем. Возможно, данный абзац повторяет
      содержание предыдущего абзаца. Рекомендуется объединить их в один абзац
    </>
  )
} as const

const getCorrelation = (value: number) => {
  if (value < CORRELATION_VALUE.WEAK) return CORRELATION.NO
  if (value < CORRELATION_VALUE.MORERATE) return CORRELATION.WEAK
  if (value < CORRELATION_VALUE.NOTABLE) return CORRELATION.MORERATE
  if (value < CORRELATION_VALUE.STRONG) return CORRELATION.NOTABLE
  return CORRELATION.STRONG
}

export const getInfo = (value: number) => {
  const correlation = getCorrelation(value)

  return {
    color: CORRELATION_COLOR[correlation],
    correlation: CORRELATION_RU[correlation]
  }
}
