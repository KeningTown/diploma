import { UploadFile } from 'antd'

import { attachment, AttachmentProps } from '../../model'

export type FormData = Omit<AttachmentProps.CreateData, 'file'> & {
  file: UploadFile[]
}

export const getInitialValues = (
  order: number,
  item?: AttachmentProps.Item
) => {
  return {
    ...(item || {}),
    type: item?.type || attachment.constants.AttachmentType.IMAGE,
    order
  }
}

export const getFile = (e: { fileList: UploadFile[] }) => {
  if (e.fileList.length) {
    return e.fileList.slice(-1)
  }

  return []
}
