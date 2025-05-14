import styled from 'styled-components'

export const Row = styled.div`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`
