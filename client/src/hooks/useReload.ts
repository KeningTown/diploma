import { useState, useCallback } from 'react'

export const useReload = () => {
  const [isReloaded, setIsReloaded] = useState(false)

  const reload = useCallback(() => {
    setIsReloaded((isReloaded) => !isReloaded)
  }, [])

  return {
    isReloaded,
    reload
  }
}
