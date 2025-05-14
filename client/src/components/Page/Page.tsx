/* eslint-disable react/prop-types */
import React, { useState, useMemo } from 'react'

import type { SetRightPanel } from './Page.types'

import { PageTitle, PageSection, PageTabs } from './components'

import * as Styled from './Page.styled'

type Components = {
  Title: typeof PageTitle
  Section: typeof PageSection
  Tabs: typeof PageTabs
}

type ChildrenProps = {
  setRightPanel: SetRightPanel
}

type Children = React.ReactNode | ((props: ChildrenProps) => React.ReactNode)

type Props = {
  fullWidth?: boolean
  centered?: boolean
  children: Children
}

const Page: React.FC<Props> & Components = ({
  fullWidth = false,
  centered = false,
  children
}) => {
  const [rightPanel, setRightPanel] = useState<React.ReactNode | null>(null)

  const child = useMemo(() => {
    if (typeof children === 'function') {
      return children({ setRightPanel })
    }

    return children
  }, [children])

  return (
    <Styled.Container $centered={centered}>
      <Styled.Inner $fullWidth={fullWidth}>{child}</Styled.Inner>
      {rightPanel && <Styled.RightPanel>{rightPanel}</Styled.RightPanel>}
    </Styled.Container>
  )
}

Page.Title = PageTitle
Page.Section = PageSection
Page.Tabs = PageTabs

export default Page
