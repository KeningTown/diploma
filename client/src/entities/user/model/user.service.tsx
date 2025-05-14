import React from 'react'

import { Item } from './user.types'

export const getFullName = (user: Item) => {
  const fullName = [user.lastName, user.firstName, user.middleName]
    .filter(Boolean)
    .join(' ')

  if (!fullName) {
    return <>&mdash;</>
  }

  return fullName
}

export const getShortName = (user: Item) => {
  const initials = [user.firstName, user.middleName]
    .filter(Boolean)
    .map((item) => item?.substring(0, 1) + '.')

  if (!user.lastName && !initials.length) {
    return <>&mdash;</>
  }

  return (
    <>
      {user.lastName}&nbsp;
      {initials}
    </>
  )
}
