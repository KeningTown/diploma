import styled from 'styled-components'

export const Container = styled.div`
  min-height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`

export const Title = styled.div`
  margin-bottom: 0 !important;
  font-weight: 500 !important;
`
