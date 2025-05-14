import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { auth } from '@/entities'

import { LOGIN, DOCUMENTS } from '@/routes'

import { useUserStore } from '@/store'

import { useRedirect } from '@/hooks'

export const useUser = (addEvent = false) => {
  const { pathname } = useLocation()
  const redirect = useRedirect()

  const { user, setUser } = useUserStore(({ user, setUser }) => ({
    user,
    setUser
  }))

  useEffect(() => {
    if (!addEvent) return

    const isLoginPage = pathname.includes(LOGIN)

    if (user) {
      if (isLoginPage) {
        redirect(DOCUMENTS)
      }

      return
    }

    if (user === null) {
      if (!isLoginPage) {
        redirect(LOGIN)
      }

      return
    }

    const item = auth.service.getUserFromAccessToken()

    setUser(item)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, user])

  useEffect(() => {
    if (!addEvent) return

    const set = () => {
      setUser(auth.service.getUserFromAccessToken())
    }

    window.addEventListener(auth.constants.STORAGE_UPDATE_EVENT, set)

    return () => {
      window.removeEventListener(auth.constants.STORAGE_UPDATE_EVENT, set)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return user
}
