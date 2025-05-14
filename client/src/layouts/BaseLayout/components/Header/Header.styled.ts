import styled from 'styled-components'

export const Container = styled.div`
  position: sticky;
  top: 0;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.atom}px;
  padding: ${({ theme }) =>
    theme.breakpoint.lg ? theme.spacing(2, 6) : theme.spacing(1, 2)};
  background-color: ${({ theme }) => theme.palette.white};
  border-bottom: ${({ theme }) => theme.border};
  z-index: 3;
  user-select: none;

  > div {
    height: 100%;
  }
`
