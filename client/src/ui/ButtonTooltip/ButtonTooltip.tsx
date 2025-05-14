import React from 'react'
import { Tooltip } from 'antd'

import Button, { ButtonProps } from '../Button/Button'

const STYLE = {
  maxWidth: 200
}

type Props = {
  icon?: ButtonProps['icon']
  text: React.ReactNode
}

const ButtonTooltip: React.FC<Props> = ({ icon = 'question', text }) => {
  return (
    <Tooltip trigger="click" title={text} overlayStyle={STYLE}>
      <Button size="small" type="text" icon={icon} />
    </Tooltip>
  )
}

export default ButtonTooltip
