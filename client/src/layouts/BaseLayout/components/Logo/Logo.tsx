import React from 'react'
import { Typography, Grid } from 'antd'

// import { Icon } from '@/ui'

import * as Styled from './Logo.styled'

const Logo: React.FC = () => {
  const { lg } = Grid.useBreakpoint()

  return (
    <>
      {/* {lg && <Icon icon="app" size={28} />} */}
      <Styled.Title as={Typography.Title} level={5}>
        {lg ? <>Human&nbsp;Intelligent&nbsp;Reading</> : <>H&nbsp;I&nbsp;R</>}
      </Styled.Title>
    </>
  )
}

export default Logo
