import React, { useMemo, useCallback, useEffect } from 'react'
import { FloatButton, Popover, Form, Checkbox, Select, InputNumber } from 'antd'

import {
  TrackerSettingsState,
  AUTO_SCROLL_SPEED_RU
} from '@/hooks/useTrackerSettings'

import { Icon, FormContent, Button } from '@/ui'

type Props = {
  state: TrackerSettingsState
  isOpened: boolean
  onOpen: () => void
  onClose: () => void
  onApply: (data: TrackerSettingsState) => void
}

const TrackerSettings: React.FC<Props> = ({
  state,
  isOpened,
  onOpen,
  onClose,
  onApply
}) => {
  const [form] = Form.useForm()

  const trackGazeValue = Form.useWatch('trackGaze', form)
  const autoScrollValue = Form.useWatch('autoScroll', form)

  useEffect(() => {
    form.setFieldsValue(state)
  }, [form, state, isOpened])

  const handleSubmit = useCallback(
    (data: TrackerSettingsState) => {
      onApply(data)
      onClose()
    },
    [onApply, onClose]
  )

  const content = useMemo(
    () => (
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <FormContent noVerticalSpace small>
          <Form.Item noStyle name="trackMouse" valuePropName="checked">
            <Checkbox>Отслеживать курсор</Checkbox>
          </Form.Item>
          <Form.Item noStyle name="trackGaze" valuePropName="checked">
            <Checkbox>Отслеживать взгляд</Checkbox>
          </Form.Item>
          {trackGazeValue && (
            <Form.Item name="screenDiagonal" label="Диагональ экрана (дюймы)">
              <InputNumber />
            </Form.Item>
          )}
          {trackGazeValue && (
            <Form.Item name="diagonalFov" label="Угол обзора камеры (градусы)">
              <InputNumber />
            </Form.Item>
          )}
          <Form.Item noStyle name="autoScroll" valuePropName="checked">
            <Checkbox>Автопрокрутка</Checkbox>
          </Form.Item>
          {autoScrollValue && (
            <Form.Item name="autoScrollSpeed" label="Скорость прокрутки">
              <Select>
                {Object.entries(AUTO_SCROLL_SPEED_RU).map(([value, label]) => (
                  <Select.Option key={value} value={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Button type="primary" htmlType="submit" style={{ marginTop: 8 }}>
            Применить
          </Button>
        </FormContent>
      </Form>
    ),
    [autoScrollValue, form, handleSubmit, trackGazeValue]
  )

  return (
    <Popover
      title="Настройки мониторинга"
      placement="topRight"
      trigger="click"
      content={content}
      overlayStyle={{ maxWidth: 'min-content' }}
      open={isOpened}
      onOpenChange={onClose}
    >
      <FloatButton
        tooltip="Настройки мониторинга"
        icon={<Icon icon="setting" />}
        onClick={onOpen}
      />
    </Popover>
  )
}

export default TrackerSettings
