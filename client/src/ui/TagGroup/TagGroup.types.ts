import React from 'react'

import { ModalProps } from '../ButtonModal/ButtonModal.types'

export type TagGroupProps = React.PropsWithChildren<{
  addModalHidden?: boolean
  addModal?: false | ((props: ModalProps) => React.ReactNode)
}>
