import React, { useCallback } from 'react'
import { App, NotificationArgsProps } from 'antd'

export const useNotification = () => {
  const { notification } = App.useApp()

  const notify = useCallback(
    (
      type: NonNullable<NotificationArgsProps['type']>,
      message: React.ReactNode,
      description?: React.ReactNode
    ) =>
      notification.open({
        duration: 4,
        type,
        message,
        description
      }),
    [notification]
  )

  return notify
}
