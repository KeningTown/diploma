import { ButtonProps } from '../Button/Button'

export type ModalProps = {
  open: boolean
  onCancel: () => void
}

export type ButtonModalProps = Omit<ButtonProps, 'onClick'> & {
  modal: (props: ModalProps) => React.ReactNode
}
