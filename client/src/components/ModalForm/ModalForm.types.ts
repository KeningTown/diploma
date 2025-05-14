import { ModalProps, FormProps } from 'antd'

import { RequestState } from '@/api'

export type ModalFormProps = Pick<ModalProps, 'open' | 'title'> &
  Pick<FormProps, 'initialValues'> &
  RequestState & {
    okText: string
    children: React.ReactNode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (values: any) => void
    onCancel: () => void
  }
