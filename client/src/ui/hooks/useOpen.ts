import { useState, useCallback } from 'react'

export const useOpen = () => {
  const [isOpened, setIsOpened] = useState(false)

  const handleOpen = useCallback(() => {
    setIsOpened(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpened(false)
  }, [])

  const handleToggle = useCallback((isOpened: boolean) => {
    setIsOpened(isOpened)
  }, [])

  return {
    isOpened,
    onOpen: handleOpen,
    onClose: handleClose,
    onToggle: handleToggle
  }
}
