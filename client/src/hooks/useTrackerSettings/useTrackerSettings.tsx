import { useState, useCallback, useEffect } from 'react'

import { TrackerSettingsState } from './useTrackerSettings.types'

import {
  DEFAULT_STATE,
  LOCAL_STORAGE_KEY
} from './useTrackerSettings.constants'

export const useTrackerSettings = () => {
  const [state, setState] = useState(DEFAULT_STATE)
  const [isOpened, setIsOpened] = useState(false)

  const saveState = useCallback((state: TrackerSettingsState) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
  }, [])

  useEffect(() => {
    const localState = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (localState) {
      setState(JSON.parse(localState))
      return
    }

    saveState(DEFAULT_STATE)
  }, [saveState])

  const handleOpen = useCallback(() => {
    setIsOpened(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpened(false)
  }, [])

  const handleApply = useCallback(
    (data: TrackerSettingsState) => {
      setState(data)
      saveState(data)
    },
    [saveState]
  )

  return {
    trackerSettings: state,
    trackerSettingsOpened: isOpened,
    onOpenTrackerSettings: handleOpen,
    onCloseTrackerSettings: handleClose,
    onApplyTrackerSettings: handleApply
  }
}

export type UseTrackerSettings = ReturnType<typeof useTrackerSettings>
