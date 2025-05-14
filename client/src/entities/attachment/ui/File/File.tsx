import React, { useMemo } from 'react'
import { Typography, Tooltip } from 'antd'

import { AttachmentProps, attachment } from '../../model'

import { ButtonRequest } from '@/components'

const STYLE = {
  maxWidth: 200,
  width: '100%',
  display: 'inline-flex',
  alignItems: 'center'
}

type Props = {
  item: AttachmentProps.Item
}

const File: React.FC<Props> = ({ item }) => {
  const name = useMemo(() => {
    return item.filename.split('_').slice(1).join('_')
  }, [item.filename])

  return (
    <Tooltip title={name}>
      <ButtonRequest
        download={name}
        icon="file"
        type="text"
        size="small"
        request={attachment.api.download}
        args={[item.filename]}
        style={STYLE}
      >
        <Typography.Text ellipsis>{name}</Typography.Text>
      </ButtonRequest>
    </Tooltip>
  )
}

export default File
