import React from 'react'

import { ButtonModalProps } from './ButtonModal.types'

import { useOpen } from '../hooks'

import Button from '../Button/Button'

const ButtonModal: React.FC<ButtonModalProps> = ({ modal, ...buttonProps }) => {
  const { isOpened, onOpen, onClose } = useOpen()

  return (
    <>
      <Button {...buttonProps} onClick={onOpen} />
      {modal({ open: isOpened, onCancel: onClose })}
    </>
  )
}

export default ButtonModal
