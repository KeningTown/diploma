import React, { useMemo, useEffect } from 'react'
import { Tag } from 'antd'

import { ParagraphProps } from '../../model'
import { term } from '../../../term'
import { termRelation } from '../../../termRelation'
import { BlockProps } from '../../../block'

import { useDocumentStore } from '@/store'

import { useRequest } from '@/hooks'

import { Card } from '@/ui'
import Text from '../Text/Text'

import * as Styled from './Definition.styled'

type Props = {
  item: ParagraphProps.Definition
  block: BlockProps.ItemAvailable
  isRecord: boolean
}

const Definition: React.FC<Props> = ({ item, block, isRecord }) => {
  const { onUpdateDefinitionTerm } = useDocumentStore(
    ({ onUpdateDefinitionTerm }) => ({ onUpdateDefinitionTerm })
  )

  const id = useMemo(() => {
    return Number(item.id.split('_').slice(-1)[0])
  }, [item.id])

  const { request, isLoading } = useRequest(term.api.readDefinition)

  useEffect(() => {
    if (item.term) {
      return
    }

    request(id).then(({ data }) => {
      onUpdateDefinitionTerm(block.id, item.id, data!)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.id, id, item.id, item.term])

  const synonyms = useMemo(
    () =>
      item?.term?.relations.filter(
        ({ type }) => type === termRelation.constants.RelationType.EQ_TO
      ),
    [item]
  )

  return (
    <Styled.Container
      as={Card}
      title={
        <>
          <Tag bordered={false} color="purple">
            {item?.term?.term}
          </Tag>
          {synonyms?.map(({ id, term }) => (
            <Tag key={id} bordered={false}>
              {term.term}
            </Tag>
          ))}
        </>
      }
      loading={isLoading}
    >
      {item?.term?.definition && (
        <Text
          paragraphId={item.id}
          text={item?.term?.definition}
          block={block}
          isRecord={isRecord}
        />
      )}
    </Styled.Container>
  )
}

export default Definition
