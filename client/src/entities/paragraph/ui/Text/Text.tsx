import React, { useMemo } from 'react'

import { ParagraphProps, paragraph } from '../../model'
import { BlockProps } from '../../../block'

import { TABLE_TAG, NEW_LINE } from '../Table/Table.constants'

import Table from '../Table/Table'
import Token from '../Token/Token'

import * as Styled from './Text.styled'

type Props = {
  isSelected?: boolean
  paragraphId: number | string
  text: string | ParagraphProps.Tokens
  block: BlockProps.Item | BlockProps.ItemAvailable
  isRecord?: boolean
}

const Text: React.FC<Props> = ({
  isSelected = false,
  paragraphId,
  text,
  block,
  isRecord
}) => {
  const children = useMemo(() => {
    if (!text) {
      return null
    }

    const str =
      typeof text === 'string' ? text : paragraph.service.tokensToStr(text)
    const parts = str.split(NEW_LINE)

    if (parts[0] !== TABLE_TAG) {
      if (typeof text === 'string') {
        return str
      }

      return text.map((token, i) => {
        if (typeof token === 'string') {
          return (
            <React.Fragment key={i}>
              {Boolean(i) && ' '}
              {token}
            </React.Fragment>
          )
        }

        return (
          <React.Fragment key={i}>
            {Boolean(i) && ' '}
            <Token
              item={token}
              block={block}
              paragraphId={paragraphId}
              isRecord={isRecord}
            />
          </React.Fragment>
        )
      })
    }

    // TODO: научиться рисовать таблицу из токенов

    return <Table parts={parts.slice(1)} />
  }, [text, block, paragraphId, isRecord])

  return (
    <Styled.Container
      $isSelected={isSelected}
      $isTable={React.isValidElement(children)}
    >
      {children}
    </Styled.Container>
  )
}

export default Text
