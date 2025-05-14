import { useState, useMemo, useCallback } from 'react'

export const useFilter = () => {
  const [filter, setFilter] = useState({})

  const handleFilter = useCallback((filter = {}) => {
    setFilter(filter)
  }, [])

  return useMemo(
    () => ({
      filter,
      onFilter: handleFilter
    }),
    [filter, handleFilter]
  )
}
