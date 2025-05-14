import React from 'react'

import * as Styled from './PageSection.styled'

type Props = React.PropsWithChildren<{
  fitContent?: boolean
  noBackground?: boolean
}>

const PageSection: React.FC<Props> = ({
  fitContent = false,
  noBackground = false,
  children
}) => {
  return (
    <Styled.Container $fitContent={fitContent} $noBackground={noBackground}>
      {children}
    </Styled.Container>
  )
}

export default PageSection
