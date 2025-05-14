import styled from 'styled-components'

export const Container = styled.div<{
  $centered: boolean
}>`
  max-width: 100%;
  display: flex;
  justify-content: ${({ $centered }) => ($centered ? 'center' : 'start')};
  gap: ${({ theme }) => theme.atom * 6}px;
`

export const Inner = styled.div<{ $fullWidth: boolean }>`
  max-width: ${({ $fullWidth }) => ($fullWidth ? '100%' : '1200px')};
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`

export const RightPanel = styled.div`
  flex-shrink: 0;
  position: sticky;
  top: 65px;
  height: calc(100vh - 65px);
  margin: ${({ theme }) => theme.spacing(-4, -6)};
  margin-left: auto;

  > * {
    height: 100%;
  }
`
