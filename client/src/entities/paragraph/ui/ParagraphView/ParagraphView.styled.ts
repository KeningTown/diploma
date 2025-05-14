import styled from 'styled-components'

import { ParagraphProps, paragraph } from '../../model'

export const Container = styled.div<{ $type: ParagraphProps.ParagraphType }>`
  margin-top: ${({ $type, theme }) =>
    $type === paragraph.constants.ParagraphType.BASIC ? 0 : -theme.atom}px;
`

export const Space = styled.div`
  width: 100%;
`
