import React from 'react'
import { Modal } from 'antd'

import { term } from '../../model'

import { ModalProps } from '@/ui'
import { Fetcher } from '@/components'

import TermGraph from './TermGraph/TermGraph'

import * as Styled from './TermGraphModal.styled'

type Props = ModalProps

const TermGraphModal: React.FC<Props> = ({ open, onCancel }) => {
  return (
    <Styled.Container
      as={Modal}
      title="Граф терминов"
      width="100%"
      open={open}
      footer={null}
      onCancel={onCancel}
    >
      <Fetcher loader request={term.api.list} args={[{ limit: 1000 }]}>
        {({ data }) => <TermGraph {...data} />}
      </Fetcher>
    </Styled.Container>
  )
}

export default TermGraphModal
