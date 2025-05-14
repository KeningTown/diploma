import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { router } from '@/services'

export const useRedirect = () => {
  const navigate = useNavigate()

  const redirect = useCallback(
    (to: string, params?: Record<string, unknown>) => {
      navigate(router.buildPath(to, params))
    },
    [navigate]
  )

  return redirect
}
