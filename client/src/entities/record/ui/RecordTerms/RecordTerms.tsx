import React from 'react'
import { Typography } from 'antd'

import { RecordProps } from '../../model'
import { term } from '../../../term'

import { Fetcher } from '@/components'

import RecordTermsTable from './RecordTermsTable/RecordTermsTable'

import * as Styled from './RecordTerms.styled'

type Props = {
  data: RecordProps.Data
}

const RecordTerms: React.FC<Props> = ({ data }) => {
  return (
    <Styled.Container>
      <Typography.Paragraph strong>Показатели терминов</Typography.Paragraph>
      <Fetcher loader request={term.api.list} args={[{ limit: 1000 }]}>
        {({ data: terms }) => (
          <RecordTermsTable data={data} terms={terms.data} />
        )}
      </Fetcher>
    </Styled.Container>
  )
}

export default RecordTerms
