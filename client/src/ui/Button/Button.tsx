import React from 'react'
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd'

import Icon, { IconProps } from '../Icon/Icon'

import * as Styled from './Button.styled'

export type ButtonProps = Omit<AntdButtonProps, 'icon'> & {
  icon?: IconProps['icon']
}

const Button: React.FC<ButtonProps> = ({ icon, ...rest }) => {
  return (
    <Styled.Container
      as={AntdButton}
      {...rest}
      icon={icon ? <Icon icon={icon} /> : undefined}
      $iconOnly={!rest.children}
    />
  )
}

export default Button
