import React, { useMemo } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Tabs } from 'antd'

import { useRedirect } from '@/hooks'

import * as Styled from './PageTabs.styled'

type Tab = {
  route: string
  label: string
  Component: React.FC
  extra?: React.ReactNode
}

type Props = {
  tabs: Tab[]
}

const PageTabs: React.FC<Props> = ({ tabs }) => {
  const { pathname } = useLocation()
  const redirect = useRedirect()

  const items = useMemo(() => {
    return tabs.map(({ route, label }) => {
      return { key: route, label }
    })
  }, [tabs])

  const activeTab = useMemo(() => {
    return tabs.find(({ route }) => {
      return pathname.includes(route)
    })
  }, [pathname, tabs])

  return (
    <>
      <Styled.Container>
        <Tabs
          activeKey={activeTab?.route}
          items={items}
          tabBarExtraContent={activeTab?.extra}
          onChange={redirect}
        />
      </Styled.Container>
      <Routes>
        <Route index element={<Navigate to={tabs[0].route} />} />
        {tabs.map(({ route, Component }) => {
          const path = route.split('/').slice(-1)[0]

          return <Route key={path} path={path} element={<Component />} />
        })}
      </Routes>
    </>
  )
}

export default PageTabs
