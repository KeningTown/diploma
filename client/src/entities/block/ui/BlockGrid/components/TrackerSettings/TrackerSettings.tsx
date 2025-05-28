import React, { useMemo, useCallback, useEffect } from 'react'
import { FloatButton, Popover, Form, Checkbox, Select, InputNumber, Modal } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom';

import {
  TrackerSettingsState,
  AUTO_SCROLL_SPEED_RU
} from '@/hooks/useTrackerSettings'

import { Icon, FormContent, Button } from '@/ui'
// import Modal from '@/components/Modal/Modal'
const { confirm } = Modal;

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
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    form.setFieldsValue(state)
  }, [form, state, isOpened])

  const handleSubmit = useCallback(
    (data: TrackerSettingsState) => {
      data.isTrained = false
      if (state.isTrained){
        data.isTrained = true
      }

      // Если пользователь выбрал «Отслеживать взгляд» 
      // и при этом модель ранее НЕ обучена (isTrained === false) → показываем confirm.
      if (data.trackGaze && !state.isTrained) {
        confirm({
          title: 'Калибровка трекера',
          content: 'Для включения отслеживания взгляда необходимо откалибровать трекер. Перейти к калибровке?',
          okText: 'Да, перейти',
          cancelText: 'Нет',
          onOk() {
            onClose(); 
            onApply(data)
            // Переходим на страницу тренировки; запомним откуда пришли
            navigate('/train', { state: { from: location.pathname } });
          },
          onCancel() {
          }
        });
        return;
      }

      onApply(data)
      onClose()
    },
    [onApply, onClose, state.isTrained, navigate, location.pathname]
  )

    const handleRetrainClick = () => {
    confirm({
      title: 'Калибровка трекера',
      content: 'Вы уверены, что хотите перекалибровать трекер? Данные с предыдущей калибровки будут потеряны.',
      okText: 'Да, откалибровать',
      cancelText: 'Отмена',
      onOk() {
        onClose();
        navigate('/train', { state: { from: location.pathname } });
      },
      onCancel(){
      }
    });
  };

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
          {/* {trackGazeValue && (
            <Form.Item name="diagonalFov" label="Угол обзора камеры (градусы)">
              <InputNumber />
            </Form.Item>
          )} */}
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
          {/* Кнопка «Переобучить модель» только если trackGazeValue=true и модель уже обучена */}
          {state.isTrained && (
            <Button
              type="default"
              style={{ width: '100%', marginTop: 8 }}
              onClick={handleRetrainClick}
            >
              Калибровка трекера
            </Button>
          )}
          <Button type="primary" htmlType="submit" style={{ marginTop: 8 }}>
            Применить
          </Button>
        </FormContent>
      </Form>
    ),
    [autoScrollValue, form, handleSubmit, trackGazeValue, state.isTrained, handleRetrainClick]
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
