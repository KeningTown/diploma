import React from 'react'
import { Link } from 'react-router-dom'
import { Tag as AntTag } from 'antd'

import { TagProps } from './Tag.types'

import Button from '../Button/Button'

import * as Styled from './Tag.styled'

const Tag: React.FC<TagProps> = ({
  isClosing,
  to,
  children,
  extra,
  onClose,
  ...props
}) => {
  return (
    <Styled.Container as={AntTag} {...props}>
      {to && !isClosing ? <Link to={to}>{children}</Link> : children}
      {onClose && (
        <Button
          type="text"
          size="small"
          icon="close"
          loading={isClosing}
          onClick={onClose}
        />
      )}
      {extra}
    </Styled.Container>
  )
}

export default Tag
