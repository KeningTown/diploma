import styled from 'styled-components'

export const Container = styled.div`
  background: none;
`

export const Sider = styled.div`
  display: ${({ theme }) => (theme.breakpoint.lg ? 'block' : 'none')};
  user-select: none;
  position: sticky !important;
  top: 0;
  height: 100vh;
  border-right: ${({ theme }) => theme.border};
`

export const Main = styled.div`
  min-height: 100vh;
`

export const Content = styled.div`
  padding: ${({ theme }) =>
    theme.breakpoint.lg ? theme.spacing(4, 6) : theme.spacing(2, 2)};
`
