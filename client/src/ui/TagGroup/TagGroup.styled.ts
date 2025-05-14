import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.atom}px;

  > * {
    margin: 0;
  }

  > button {
    width: 22px !important;
    height: 22px !important;
    display: flex;
    justify-content: center;
    align-items: center;

    > span * {
      font-size: 12px !important;
    }
  }
`
