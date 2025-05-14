import React from 'react'
import { Space, Tag } from 'antd'

import * as Styled from './Filter.styled'

const Filter: React.FC = () => {
  return (
    <>
      {/* <Dropdown
        trigger={['click']}
        menu={{ items: [{ key: '1', label: 'Test' }] }}
      > */}
      <Styled.Container as={Space} wrap size={[4, 4]}>
        <Styled.Tag
          as={Tag}
          closeIcon
          bordered={false}
          onClick={() => console.log(1)}
          onClose={(e) => {
            e.preventDefault()
          }}
        >
          Hello
        </Styled.Tag>
        <Styled.Tag as={Tag} bordered={false}>
          World
        </Styled.Tag>
      </Styled.Container>
      {/* </Dropdown> */}
    </>
  )
}

export default Filter
