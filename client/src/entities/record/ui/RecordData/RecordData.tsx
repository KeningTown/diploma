import React from 'react'

import { RecordProps } from '../../model'
import { Block } from '../../../block'

import * as Styled from './RecordData.styled'

type Props = {
  data: RecordProps.Data
}

const RecordData: React.FC<Props> = ({ data }) => {
  return (
    <Styled.Container>
      <Block.BlockGrid
        width={data.width}
        items={data.blocks}
        documentResult={data.result}
        documentGazes={data.gazes}
      />
    </Styled.Container>
  )
}

export default RecordData
