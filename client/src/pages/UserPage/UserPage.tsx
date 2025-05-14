import React from 'react'

import { User } from '@/entities'

import { useUser } from '@/hooks'

import { Page } from '@/components'

const UserPage: React.FC = () => {
  const user = useUser()

  return (
    <Page>
      <Page.Title>Профиль</Page.Title>
      <Page.Section>
        {user && <User.UserInfo isProfile item={user} />}
      </Page.Section>
    </Page>
  )
}

export default UserPage
