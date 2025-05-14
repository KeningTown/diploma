import React from 'react'
import { Space } from 'antd'

import { AttachmentProps } from '../../model'

import File from '../File/File'

type Props = {
  items: AttachmentProps.Collection
}

const Files: React.FC<Props> = ({ items }) => {
  if (!items.length) {
    return null
  }

  return (
    <Space wrap>
      {items.map((item) => (
        <File key={item.id} item={item} />
      ))}
    </Space>
  )
}

export default Files
