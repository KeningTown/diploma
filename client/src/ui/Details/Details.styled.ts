import styled from 'styled-components'

export const Container = styled.div`
  th {
    width: 0;
    white-space: nowrap;
  }
`

export const Title = styled.div`
  margin-right: ${({ theme }) => theme.atom * 4}px;
`
