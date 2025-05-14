import React from 'react'
import { Tooltip } from 'antd'

import { TermAnalysisProps, termAnalysis } from '../../model'

import { ButtonRequest, Value, ValueType } from '@/components'

// TODO: polling

type Props = {
  item?: TermAnalysisProps.Item
  onSuccess: () => void
}

const TermAnalysisCreate: React.FC<Props> = ({ item, onSuccess }) => {
  const disabled = item && !item.isFinished

  return (
    <Tooltip
      placement="topRight"
      arrow={{ pointAtCenter: true }}
      title={
        disabled ? (
          <>
            Предыдущий анализ еще не завершен.
            <br />
            Запущен:{' '}
            <Value inline type={ValueType.DATE}>
              {item.createdAt}
            </Value>
          </>
        ) : undefined
      }
    >
      <ButtonRequest
        disabled={disabled}
        request={termAnalysis.api.create}
        successMessage="Анализ запущен"
        errorMessage="Не удалось запустить анализ"
        onSuccess={onSuccess}
      >
        Запустить анализ
      </ButtonRequest>
    </Tooltip>
  )
}

export default TermAnalysisCreate
