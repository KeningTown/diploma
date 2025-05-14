import { useState, useCallback } from 'react'

export type SettingsState = {
  gazeMap: boolean
  heatMap: boolean
}

export type Setting = keyof SettingsState

export type HandleChangeSetting = (
  field: Setting,
  value: SettingsState[typeof field]
) => void

const defaultSettings: SettingsState = {
  gazeMap: true,
  heatMap: false
}

export const useSettings = () => {
  const [settings, setSettings] = useState(defaultSettings)

  const handleChangeSetting = useCallback<HandleChangeSetting>(
    (field, value) => {
      setSettings((settings) => ({
        ...settings,
        [field]: value
      }))
    },
    []
  )

  return {
    settings,
    onChangeSetting: handleChangeSetting
  }
}
