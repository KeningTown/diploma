import React from 'react'

import { Auth } from '@/entities'

import { Page } from '@/components'

const LoginPage: React.FC = () => {
  return (
    <Page>
      <Page.Title>Вход</Page.Title>
      <Page.Section fitContent>
        <Auth.LoginForm />
      </Page.Section>
    </Page>
  )
}

export default LoginPage
