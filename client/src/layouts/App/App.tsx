import React from 'react'
import { ConfigProvider, App as AntdApp, Spin, Grid } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import { ThemeProvider } from 'styled-components'

import { useUser } from '@/hooks'

import { themeConfig, theme, Theme } from '@/ui/theme'

import Routing from './Routing'

import * as Styled from './App.styled'

const App: React.FC = () => {
  const breakpoint = Grid.useBreakpoint() as Theme['breakpoint']

  const user = useUser(true)

  return (
    <ConfigProvider locale={ruRU} theme={themeConfig}>
      <AntdApp>
        <ThemeProvider theme={{ ...theme, breakpoint }}>
          {user === undefined ? (
            <Styled.Loader>
              <Spin size="large" />
            </Styled.Loader>
          ) : (
            <Routing />
          )}
        </ThemeProvider>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
