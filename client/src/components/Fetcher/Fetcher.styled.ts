import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  max-width: 500px;
  gap: 12px;

  > span {
    margin: 0 !important;
  }
`

export const Pagination = styled.div`
  margin-top: ${({ theme }) => theme.atom * 2}px;
`
