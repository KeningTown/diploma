import React from 'react'

import { ICON } from './Icon.constants'

import * as Styled from './Icon.styled'

export type IconProps = {
  icon: keyof typeof ICON
  size?: number
}

const Icon: React.FC<IconProps> = ({ icon, size }) => {
  const Component = ICON[icon]

  if (!Component) {
    return icon
  }

  return <Styled.Container as={Component} $size={size} />
}

export default Icon
