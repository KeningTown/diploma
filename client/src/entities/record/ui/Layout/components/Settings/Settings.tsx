import React, { useMemo } from 'react'
import { Space, Checkbox, Popover, FloatButton } from 'antd'

import { SettingsState, HandleChangeSetting } from '../../hooks/useSettings'

import { Icon } from '@/ui'

type Props = {
  state: SettingsState
  onChange: HandleChangeSetting
}

const Settings: React.FC<Props> = ({ state, onChange }) => {
  const content = useMemo(
    () => (
      <Space direction="vertical">
        <Checkbox
          checked={state.gazeMap}
          onChange={(e) => onChange('gazeMap', e.target.checked)}
        >
          Карта пути взгляда
        </Checkbox>
        <Checkbox
          checked={state.heatMap}
          onChange={(e) => onChange('heatMap', e.target.checked)}
        >
          Тепловая карта
        </Checkbox>
      </Space>
    ),
    [onChange, state]
  )

  return (
    <Popover
      title="Настройки отображения"
      placement="topRight"
      trigger="click"
      content={content}
    >
      <FloatButton type="primary" icon={<Icon icon="setting" />} />
    </Popover>
  )
}

export default Settings
